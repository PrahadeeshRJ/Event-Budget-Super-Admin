import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

export default async function UserProfileImage() {
  const supabase = createClient();

  // Fetch user information
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // Handle case where user is not logged in
  }

  // Fetch user's profile data
  const { data: userData } = await supabase
    .from("users")
    .select("username")
    .eq("email", user.email)
    .single();

  const displayName = userData?.username || user.email!.split("@")[0];

  // Fetch user's profile image URL
  let userImageUrl = "/images/cropped-favicon-180x180.png";
  const { data } = await supabase.storage
    .from("Event-Budget")
    .getPublicUrl(`users/${user.id}.png`);

  if (data?.publicUrl) {
    const imageResponse = await fetch(data.publicUrl);
    if (imageResponse.ok) {
      userImageUrl = `${data.publicUrl}?t=${new Date().getTime()}`;
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="-mr-2 text-sm font-semibold text-primary-text_primary">{displayName}</div>
      <Image
        src={userImageUrl}
        width={26}
        height={26}
        alt="User Image"
        className="rounded-full object-contain"
      />
    </div>
  );
}
