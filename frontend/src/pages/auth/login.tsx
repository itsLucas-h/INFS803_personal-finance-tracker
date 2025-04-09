import React from "react";
import Head from "next/head";
import { LoginForm } from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login | Finance Tracker</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <LoginForm />
      </div>
    </>
  );
};

export default LoginPage;
