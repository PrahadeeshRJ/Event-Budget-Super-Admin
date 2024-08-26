
import Image from "next/image";
import Link from "next/link";
import UserProfileImage from "./navbar/userprofile";
import LogoutButton from "./logoutbutton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Navbar() {
  return (
    <header className="px-4 py-3 sticky top-0 border-b border-[#D4D4D8] bg-[#FAFAFA] z-20">
      <nav className="flex justify-between items-center gap-[2px]">
        <div>
          <Link href="/dashboard">
            <Image
              src="/images/logo.png"
              width={106}
              height={40}
              alt="logo"
              className="border rounded border-[#D4D4D8]"
            />
          </Link>
        </div>
        <ul className="flex items-center space-x-2">
          <Link href="/profile">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <li className="py-1.5 px-1.5 h-[40px] border rounded border-[#D4D4D8] flex items-center gap-1 text-sm font-medium cursor-pointer">
                    <UserProfileImage />
                  </li>
                </TooltipTrigger>
                <TooltipContent className="bg-white">
                  <p>Profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
          <LogoutButton />
        </ul>
      </nav>
    </header>
  );
}
