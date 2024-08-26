'use client';
import { useState } from "react";
import { SubmitButton } from "./submit-button";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const [message, setMessage] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); 

  // Sign up handler
  const signUp = async (formData: FormData) => {
    const email = formData.get("email") as string;

    // Ensure the passwords match before signing up
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true); // Set loading state to true

    const res = await fetch('/auth/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setIsLoading(false); // Reset loading state after request

    if (!res.ok) {
      setMessage(data.error || 'Could not authenticate user');
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">

      <div className="absolute top-0 left-0 p-4"> 
        <Link href="/dashboard">
          <Image src="/images/logo.png" width={106} height={40} alt="logo" className="border rounded border-[#D4D4D8]" />
        </Link>
      </div>

      <div className="w-1/2 flex items-center justify-center p-6">
        <form className="animate-in flex flex-col justify-center gap text-foreground w-[600px]" onSubmit={(e) => {
          e.preventDefault();
          signUp(new FormData(e.target as HTMLFormElement));
        }}>
          <div className="my-5">
            <h1 className="text-[30px] font-bold text-primary-text_primary">Sign Up</h1>
            <p className="text-sm text-[#A1A1AA]">Create an account to manage your events</p>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <Eye size={18} className="text-gray-500"/> : <EyeOff size={18} className="text-gray-500"/>}
            </button>
          </div>
          <label className="text-sm text-primary-text_primary font-semibold" htmlFor="confirm-password">
            Confirm Password
          </label>
          <div className="relative mb-6">
            <input
              className="rounded-[6px] border-[#D4D4D8] px-4 py-2 bg-inherit border text-sm w-full"
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirm-password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? <Eye size={18} className="text-gray-500"/> : <EyeOff size={18} className="text-gray-500"/>}
            </button>
          </div>
          <SubmitButton
            type="submit"
            className="bg-[#1A80F4] text-[white] text-sm px-4 py-2 border border-[#1A80F4] rounded mb-2 hover:bg-[#32A0FF]"
            pendingText={isLoading ? "Signing Up..." : "Sign Up"} // Show pending text
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </SubmitButton>
          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-[#1A80F4] hover:underline">
              Log In
            </a>
          </p>

          {message && (
            <p className="mt-4 p-4 text-sm bg-gray-100 rounded text-gray-700 text-center">
              {message}
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
