import { useState } from "react";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const useRegisterForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, form, {
        withCredentials: true,
      });

      setSuccess("Account created successfully! Redirecting to login...");
      setForm({ name: "", email: "", password: "" });

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return { form, error, success, handleChange, handleSubmit };
};
