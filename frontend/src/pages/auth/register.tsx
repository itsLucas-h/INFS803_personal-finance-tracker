import React from "react";
import Head from "next/head";
import { RegisterForm } from "@/components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <>
      <Head>
        <title>Register | Finance Tracker</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <RegisterForm />
      </div>
    </>
  );
};

export default RegisterPage;
