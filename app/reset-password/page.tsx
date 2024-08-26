'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPassword({ searchParams }: { searchParams: { message: string; code: string } }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(searchParams?.message || null);
  const router = useRouter();

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: searchParams.code, password }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        setMessage(data.error || 'Could not reset password. Please try again.');
      } else {
        setMessage(data.message);
        router.push('/login?message=Your Password has been reset successfully. Sign in.');
      }
    } catch (error) {
      setIsLoading(false);
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      
      <div className="absolute top-0 left-0 p-4">
        <Link href="/">
          <Image src="/images/logo.png" width={106} height={40} alt="logo" className="border rounded border-[#D4D4D8]" />
        </Link>
      </div>

      <div className="w-1/2 flex items-center justify-center p-6">
        <form
          className="animate-in flex flex-col justify-center gap text-foreground w-[600px]"
          onSubmit={handleResetPassword}
        >
          <div className="my-5">
            <h1 className="text-[30px] font-bold text-primary-text_primary">Reset Password</h1>
            <p className="text-sm text-[#A1A1AA]">Enter your new password below</p>
          </div>

          <label className="text-sm text-primary-text_primary font-semibold" htmlFor="password">
            New Password
          </label>
          <div className="relative mb-6">
            <input
              className="rounded-[6px] border-[#D4D4D8] px-4 py-2 bg-inherit border text-sm w-full"
              type={passwordVisible ? 'text' : 'password'}
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
              {passwordVisible ? <Eye size={18} className="text-gray-500" /> : <EyeOff size={18} className="text-gray-500" />}
            </button>
          </div>

          <label className="text-sm text-primary-text_primary font-semibold" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <div className="relative mb-6">
            <input
              className="rounded-[6px] border-[#D4D4D8] px-4 py-2 bg-inherit border text-sm w-full"
              type={confirmPasswordVisible ? 'text' : 'password'}
              name="confirmPassword"
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
              {confirmPasswordVisible ? <Eye size={18} className="text-gray-500" /> : <EyeOff size={18} className="text-gray-500" />}
            </button>
          </div>

          <button
            type="submit"
            className="bg-[#1A80F4] text-[white] text-sm px-4 py-2 border border-[#1A80F4] rounded mb-2 hover:bg-[#32A0FF]"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset'}
          </button>
          <p className="text-sm text-center text-gray-500">
            Remember your password?{" "}
            <a href="/login" className="text-[#1A80F4] hover:underline">
              Sign In
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
