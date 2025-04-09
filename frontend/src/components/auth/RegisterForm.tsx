import React from "react";
import Link from "next/link";
import { useRegisterForm } from "../hooks/useRegisterForm";

export const RegisterForm: React.FC = () => {
  const { form, error, handleChange, handleSubmit } = useRegisterForm();

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          Create Account
        </h1>
        <p className="text-gray-500 text-sm">Join the finance tracker today</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-2 rounded text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md font-medium transition-all duration-200"
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
