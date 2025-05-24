"use client";

import React from "react";
import UploadFileForm from "@/components/file/UploadFileForm";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function FilesPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-1">
            File Uploads
          </h1>
          <p className="text-gray-500">
            Upload documents and manage your uploaded files
          </p>
        </div>

        {/* File Upload Form and List */}
        <UploadFileForm />
      </div>
    </DashboardLayout>
  );
}
