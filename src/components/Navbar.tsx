import Image from "next/image";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/actions/session";
import { redirect } from "next/navigation";
import UserButton from "./UserButton";
import { getDataUser } from "@/lib/actions/data-user";
import prisma from "@/lib/prisma";
import AnnouncementCount from "./AnnouncementCount";
import { Role } from "@prisma/client";

const Navbar = async () => {
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  if (!session) {
    redirect("/");
  }

  const dataUser = await getDataUser(String(session.id), String(session.role));
  if (!dataUser) {
    redirect("/");
  }

  let announcements = [];
  const role = session.role as Role;

  if (role === "STUDENT") {
    // Get student's class
    const student = await prisma.student.findUnique({
      where: { id: Number(session.id) },
      include: { class: true }
    });

    // Get announcements that are either public (no classId) or specific to student's class
    announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { classId: null },
          { classId: student?.classId }
        ]
      },
      orderBy: {
        date: "desc",
      },
    });
  } else {
    // For ADMIN, TEACHER, and PARENT, show all announcements
    announcements = await prisma.announcement.findMany({
      orderBy: {
        date: "desc",
      },
    });
  }

  return (
    <div className="flex items-center justify-between p-4">
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <AnnouncementCount announcement={announcements} />
        <UserButton dataUser={dataUser} />
      </div>
    </div>
  );
};

export default Navbar;
