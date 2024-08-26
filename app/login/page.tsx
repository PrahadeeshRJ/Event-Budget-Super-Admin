"use client";

import { useState } from "react";
import { SubmitButton } from "./submit-button";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function Login({ searchParams }: { searchParams: { message: string } }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setLoading(true); // Set loading to true

    const response = await fetch("/auth/login", {
      method: "POST",
      body: formData,
    });

    setLoading(false); // Reset loading state

    // Check if the response is not okay (indicating an error)
    if (!response.ok) {
      const data = await response.json(); // Parse JSON response
      setErrorMessage(data.error); // Set error message from response
    } else {
      // Handle success response
      window.location.href = "/dashboard"; // Redirect to the dashboard on success
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden relative"> {/* Add relative positioning to the parent */}
      
      {/* Logo Section */}
      <div className="absolute top-0 left-0 p-4"> {/* Absolute positioning for logo */}
        <Link href="/dashboard">
          <Image src="/images/logo.png" width={106} height={40} alt="logo" className="border rounded border-[#D4D4D8]" />
        </Link>
      </div>

      <div className="w-1/2 flex items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="animate-in flex flex-col justify-center gap text-foreground w-[600px] ">
          <div className="my-5">
            <h1 className="text-[30px] font-bold text-primary-text_primary">Sign In</h1>
            <p className="text-sm text-[#A1A1AA]">Access your account to manage your events</p>
          </div>
          <label className="text-sm text-primary-text_primary font-semibold" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-[6px] border-[#D4D4D8] px-4 py-2 bg-inherit border mt-2 mb-6 text-sm"
            name="email"
            placeholder="Enter your email"
            required
          />
          <label className="text-sm text-primary-text_primary font-semibold" htmlFor="password">
            Password
          </label>
          <div className="relative mb-6">
            <input
              className="rounded-[6px] border-[#D4D4D8] px-4 py-2 bg-inherit border text-sm w-full"
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <Eye  size={18} className="text-gray-500"/> : <EyeOff size={18} className="text-gray-500"/>}
            </button>
          </div>
          <SubmitButton
            formAction={async (formData) => {}}
            className="bg-[#1A80F4] text-[white] text-sm px-4 py-2 border border-[#1A80F4] rounded mb-2 hover:bg-[#32A0FF]"
            pendingText={"Logging In..." } 
          >
            {loading ? "Logging In..." : "Log In"} 
          </SubmitButton>
          <div className="flex flex-row justify-between py-2">
          <p className="text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <a href="/sign-up" className="text-[#1A80F4] hover:underline">
              Sign Up
            </a>
          </p>
          <Link
          href="/forgot-password"
          className="rounded-md no-underline text-[#1A80F4] text-sm "
        >
          Forgot Password
        </Link>
        </div>
          {searchParams?.message && (
            <p className="mt-4 p-4 text-sm bg-green-100 rounded text-green-700 text-center">
              {searchParams.message}
            </p>
          )}
          {errorMessage && (
            <p className="mt-4 p-4 text-sm bg-red-100 rounded text-red-700 text-center">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
      <div className="w-1/2">
        <div
          className="bg-cover bg-center z-1 h-full shadow-2xl"
          style={{
            backgroundImage: 'url("/images/login-banner.png")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom',
            backgroundSize: 'cover',
          }}
        ></div>
      </div>
    </div>
  );
}
