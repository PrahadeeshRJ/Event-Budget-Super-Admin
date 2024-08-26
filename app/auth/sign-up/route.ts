import { NextResponse } from 'next/server';
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const origin = headers().get("origin");
  const { email, password } = await request.json();
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Return the redirect URL and message
  return NextResponse.json({
    redirect: "/login",
    message: "Check email to continue sign-in process",
  }, { status: 200 });
}
