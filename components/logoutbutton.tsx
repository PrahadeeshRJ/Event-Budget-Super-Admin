// components/LogoutButton.tsx

import { LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export default function LogoutButton() {
  const signOut = async () => {
    "use server";
    const supabase = createClient();
    const {
        data: { user },
      } = await supabase.auth.getUser();
    
      if (!user) {
        redirect("/login");
      }
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <li className="py-2.5 px-3 border rounded bg-button_orange text-primary-accent border-primary-accent bg-blue-50 cursor-pointer w-[44px] h-[40px]">
          <LogOut size={20} />
        </li>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white rounded">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-primary-text_primary font-bold">Confirm Log Out</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-500 font-normal">
            Are you sure you want to log out? You will need to log in again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded border-[#D4D4D8] bg-[#FAFAFA] text-primary-text_primary">
            Cancel
          </AlertDialogCancel>
          <form action={signOut}>
            <AlertDialogAction type="submit" className="border rounded p-4 bg-red-600 text-white hover:bg-red-700">
              Log Out
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
