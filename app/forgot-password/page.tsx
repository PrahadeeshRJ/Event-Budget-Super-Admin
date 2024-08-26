'use client';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { confirmReset } from '@/app/auth/confirmReset';

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const [email, setEmail] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    await confirmReset(formData); // Call the server function
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
          onSubmit={handleSubmit}
        >
          <div className="my-5">
            <h1 className="text-[24px] font-bold text-primary-text_primary">Forgot Password</h1>
            <p className="text-sm text-[#A1A1AA]">Enter your email to reset your password</p>
          </div>
          <label className="text-sm text-primary-text_primary font-semibold" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-[6px] border-[#D4D4D8] px-4 py-2 bg-inherit border mt-2 mb-6 text-sm"
            name="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="bg-[#1A80F4] text-[white] text-sm px-4 py-2 border border-[#1A80F4] rounded mb-2 hover:bg-[#32A0FF]">
            Confirm
          </button>
          {searchParams?.message && (
            <p className="mt-4 p-4 text-sm bg-gray-100 rounded text-gray-700 text-center">
              {searchParams.message}
            </p>
          )}
          <p className="rounded-md no-underline text-sm text-center mt-4">Remember your password? <span>
          <Link
            href="/login"
            className="rounded-md no-underline text-sm text-center mt-4 text-[#1A80F4]"
          >
             Sign in
          </Link></span></p>
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
