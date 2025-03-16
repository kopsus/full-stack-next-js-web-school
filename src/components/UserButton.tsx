"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";
import { Admin, Student, Parent, Teacher } from "@prisma/client";
import { useRouter } from "next/navigation";
import logout from "@/lib/actions/logout";

interface UserButtonProps {
  dataUser: Admin | Teacher | Student | Parent;
}

export default function UserButton({ dataUser }: UserButtonProps) {
  const handleLogout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await logout();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-xs leading-3 font-medium">
              {dataUser.first_name} {dataUser.last_name}
            </span>
            <span className="text-[10px] text-gray-500 text-right">
              {dataUser.role}
            </span>
          </div>

          <Avatar className="h-8 w-8 cursor-pointer border-2 border-gray-300">
            <AvatarImage
              src={`/uploads/${dataUser.img || "/avatar.png"}`}
              alt="User avatar"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-48" align="end">
        <div className="flex flex-col gap-2">
          <Link
            href="/profile"
            className="px-4 py-2 text-sm hover:bg-gray-100 rounded-md transition flex items-center gap-2"
          >
            <Image src="/profile.png" alt="" width={16} height={16} />
            Profil
          </Link>
          <form onSubmit={handleLogout}>
            <Button
              type="submit"
              variant="destructive"
              size="default"
              className="border-none outline-none w-full flex items-center justify-start gap-2 px-4 py-2"
            >
              <LogOutIcon className="w-4 h-4" />
              Keluar
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
