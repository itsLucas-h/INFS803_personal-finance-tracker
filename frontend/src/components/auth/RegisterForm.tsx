import React from "react";
import Link from "next/link";
import { useRegisterForm } from "../hooks/useRegisterForm";

export const RegisterForm: React.FC = () => {
  const { form, error, success, handleChange, handleSubmit } =
    useRegisterForm();

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          Create Account
        </h1>
        <p className="text-gray-500 text-sm">Join the finance tracker today</p>
      </div>

      {success && (
        <div
          role="status"
          className="bg-green-100 text-green-600 px-4 py-2 rounded text-sm text-center"
        >
          {success}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="bg-red-100 text-red-600 px-4 py-2 rounded text-sm text-center"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
            placeholder="e.g. John Smith"
            className="w-full px-3 py-2 border rounded-md text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="e.g. user@example.com"
            className="w-full px-3 py-2 border rounded-md text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            placeholder="e.g. At least 8 characters"
            className="w-full px-3 py-2 border rounded-md text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sign Up
        </button>
      </form>

      <div className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-blue-600 hover:underline font-medium"
        >
          Login
        </Link>
      </div>
    </div>
  );
};
