"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface ProfileUpdateFormProps {
  username: string;
  setUsername: (name: string) => void;
  refreshUser: () => Promise<void>;
  apiBaseUrl: string;
}

const STYLES = {
  input:
    "w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400",
  error: "mt-1 text-sm text-red-600",
  label: "block text-sm font-medium text-gray-700 mb-1",
  button:
    "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
};

export default function ProfileUpdateForm({
  username,
  setUsername,
  refreshUser,
  apiBaseUrl,
}: ProfileUpdateFormProps) {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${apiBaseUrl}/api/user/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: username,
          email,
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      setMessage("Profile updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setEmail("");

      await refreshUser();
    } catch {
      setError("An error occurred while updating your profile.");
    }
  };

  const renderPasswordField = (
    id: string,
    label: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    show: boolean,
    toggle: () => void,
    placeholder: string
  ) => (
    <div className="relative">
      <label htmlFor={id} className={STYLES.label}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={STYLES.input}
        placeholder={placeholder}
        required={id === "currentPassword"}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <h2 className="text-xl font-medium text-gray-800">Update Profile</h2>

      <div>
        <label htmlFor="username" className={STYLES.label}>
          New Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={STYLES.input}
          required
          placeholder="Enter new username"
        />
      </div>

      <div>
        <label htmlFor="email" className={STYLES.label}>
          New Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={STYLES.input}
          placeholder="Enter new email"
        />
      </div>

      {renderPasswordField(
        "currentPassword",
        "Current Password*",
        currentPassword,
        setCurrentPassword,
        showCurrent,
        () => setShowCurrent((prev) => !prev),
        "Enter current password"
      )}

      {renderPasswordField(
        "newPassword",
        "New Password",
        newPassword,
        setNewPassword,
        showNew,
        () => setShowNew((prev) => !prev),
        "Enter new password"
      )}

      {error && <p className={STYLES.error}>{error}</p>}
      {message && <p className="text-green-600 text-sm">{message}</p>}

      <button type="submit" className={STYLES.button}>
        Save Changes
      </button>
    </form>
  );
}
