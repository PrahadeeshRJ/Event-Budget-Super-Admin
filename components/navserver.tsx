// Navbar.server.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function getUserData() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
