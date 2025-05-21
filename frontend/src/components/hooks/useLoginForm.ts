import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

interface LoginFormState {
  email: string;
  password: string;
}

export const useLoginForm = () => {
  const router = useRouter();

  const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        const res = await axios.post(`${API_BASE_URL}/api/auth/login`, form, {
          withCredentials: true,
        });

        const token = res.data.token;
        localStorage.setItem("token", token);

        router.push("/dashboard");
      } catch (err: unknown) {
        const error = err as AxiosError<{ message: string }>;
        setError(error.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    },
    [form, router]
  );

  return { form, error, loading, handleChange, handleSubmit };
};
