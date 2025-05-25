"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProfileUpdateForm from "@/components/profile/ProfileUpdateForm";

interface User {
  name: string;
  email: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      setUser(data.user);
      setUsername(data.user.name);
    } catch (err) {
      console.error("Unable to load user profile:", err);
      setError("Unable to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-gray-600">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow space-y-8">
        {/* Header */}
        {user && (
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-1">
              Hi, {user.name} 👋
            </h1>
            <p className="text-gray-500">
              Manage your profile and account settings
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Current Info */}
        {user && (
          <div className="text-gray-500 bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
            <p>
              <strong>Current Username:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        )}

        {/* Profile Update Form */}
        <ProfileUpdateForm
          username={username}
          setUsername={setUsername}
          refreshUser={fetchUser}
          apiBaseUrl={API_BASE_URL}
        />
      </div>
    </DashboardLayout>
  );
}
