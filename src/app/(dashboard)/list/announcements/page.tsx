import prisma from "@/lib/prisma";

import { decrypt } from "@/lib/actions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import ButtonCreateAnnouncement from "@/components/forms/announcement/AnnouncementFormCreate";
import { Role } from "@prisma/client";

const AnnouncementListPage = async () => {

  const session = await decrypt(cookies().get("session")?.value);

  if (!session) {
    redirect("/");
  }

  const role = session.role as Role;

  let announcements = [];

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
        id: "desc",
      },
    });
  } else {
    // For ADMIN and TEACHER, show all announcements
    announcements = await prisma.announcement.findMany({
      orderBy: {
        id: "desc",
      },
    });
  }

  const allClasses = await prisma.class.findMany();

  const announcementsWithDetails = announcements.map(announcement => ({
    ...announcement,
    allClasses: allClasses,
    roleLogin: session.role as Role
  }));

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex flex-col md:flex-row gap-2 mb-2 justify-between md:items-center">
        <h1 className="text-lg font-semibold">Data Pengumuman</h1>
        {(role === "ADMIN" || role === "TEACHER") && (
          <ButtonCreateAnnouncement allClasses={allClasses} />
        )}
      </div>
      {/* table */}
      <DataTable columns={columns} data={announcementsWithDetails} />
    </div>
  );
};

export default AnnouncementListPage;
