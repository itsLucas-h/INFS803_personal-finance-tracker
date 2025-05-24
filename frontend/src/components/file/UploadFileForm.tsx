"use client";

import React, { useState, useEffect, DragEvent, useRef } from "react";
import { InboxArrowDownIcon } from "@heroicons/react/24/outline";

interface UploadedFile {
  id: number;
  key: string;
  originalName: string;
  size: number;
  mimeType: string;
  downloadCount: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function FileManager() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingFiles, setFetchingFiles] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    setFetchingFiles(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/files`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error("Error loading files:", err);
      setError("Failed to load files. Please try again later.");
    } finally {
      setFetchingFiles(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const newFile = e.dataTransfer.files[0];
      setFile(newFile);
      setSelectedFileName(newFile.name);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const newFile = e.target.files[0];
      setFile(newFile);
      setSelectedFileName(newFile.name);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());

      setMessage("File uploaded successfully!");
      setFile(null);
      setSelectedFileName(null);
      if (inputRef.current) inputRef.current.value = "";
      await fetchFiles();
    } catch (err) {
      console.error("Upload error:", err);
      setError("File upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewFile = async (fileKey: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/files/view?key=${fileKey}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data.url) window.open(data.url, "_blank");
    } catch (err) {
      console.error("View error:", err);
      alert("Unable to view file.");
    }
  };

  const handleDownloadFile = async (fileKey: string, originalName: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/files/download?key=${fileKey}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      if (!data.url) throw new Error("Download URL not provided by server.");

      const anchor = document.createElement("a");
      anchor.href = data.url;
      anchor.download = originalName;
      anchor.target = "_blank";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      await fetchFiles();
    } catch (err) {
      console.error("Download error:", err);
      alert("Unable to download file.");
    }
  };

  const handleDeleteFile = async (fileKey: string) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    setMessage("");
    setError("");
    setFetchingFiles(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/files?key=${fileKey}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error(await res.text());

      setMessage("File deleted successfully.");
      setFile(null);
      setSelectedFileName(null);
      if (inputRef.current) inputRef.current.value = "";
      await fetchFiles();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete file. Please try again.");
    } finally {
      setFetchingFiles(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drag-and-Drop Upload Area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50"
        } hover:border-blue-500`}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex flex-col items-center space-y-2 text-gray-700">
          <InboxArrowDownIcon className="h-12 w-12 text-blue-500" />
          <p className="text-sm font-medium">Click or drag a file to upload</p>
          {selectedFileName && (
            <p className="text-sm text-gray-800 font-semibold mt-2">
              {selectedFileName}
            </p>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <form onSubmit={handleUpload} className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !file}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Feedback */}
      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* File List */}
      <div className="mt-6">
        <h3 className="text-md font-medium text-gray-800 mb-2">
          Uploaded Files
        </h3>
        {fetchingFiles ? (
          <p className="text-sm text-gray-500">Loading files...</p>
        ) : files.length === 0 ? (
          <p className="text-sm text-gray-500">No files uploaded yet.</p>
        ) : (
          <ul className="space-y-2">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex justify-between items-center bg-white px-4 py-2 rounded border"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.round(file.size / 1024)} KB • {file.mimeType} •{" "}
                    {file.downloadCount} downloads
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewFile(file.key)}
                    className="cursor-pointer px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-700 transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() =>
                      handleDownloadFile(file.key, file.originalName)
                    }
                    className="cursor-pointer px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-700 transition"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.key)}
                    className="cursor-pointer px-3 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
