"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function MenuLink({ item, role }: { item: any, role: string }) {

  const pathname = usePathname();

  // Check if current path exactly matches item href or matches role-specific home page
  const isActive =
    (item.href === "/" && pathname === "/") || // Beranda active only on exact match
    (item.href !== "/" && pathname.startsWith(item.href)) || // Any other section active
    (item.href === "/" && (
      (role === "ADMIN" && pathname.startsWith("/admin")) ||
      (role === "TEACHER" && pathname.startsWith("/teacher")) ||
      (role === "STUDENT" && pathname.startsWith("/student")) ||
      (role === "PARENT" && pathname.startsWith("/parent"))
    ));

  return (
    <Link
      href={item.href}
      key={item.label}
      prefetch={true} // default is true
      className={`flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md ${isActive ? "bg-lamaSkyLight" : "hover:bg-lamaSkyLight"
        }`}
    >
      <Image src={item.icon} alt="" width={20} height={20} />
      <span className="hidden lg:block">{item.label}</span>
    </Link>
  );
}
