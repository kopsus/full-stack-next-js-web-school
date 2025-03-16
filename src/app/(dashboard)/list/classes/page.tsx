import prisma from "@/lib/prisma";

import { decrypt } from "@/lib/actions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import ButtonCreateClass from "@/components/forms/class/ClassFormCreate";
import { Role } from "@prisma/client";
const ClassListPage = async () => {
  const session = await decrypt(cookies().get("session")?.value);

  if (!session) {
    redirect("/");
  }

  const role = session.role;

  const classes = await prisma.class.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      grade: true,
      supervisor: true,
    },
  });

  const allTeachers = await prisma.teacher.findMany();
  const allGrades = await prisma.grade.findMany();

  const data = {
    classes: classes.map((classItem) => ({
      ...classItem,
      allTeachers: allTeachers,
      allGrades: allGrades,
      roleLogin: role as Role,
    })),
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
        <h1 className="text-lg font-semibold">Data Kelas</h1>
        {role === "ADMIN" && (
          <ButtonCreateClass teachers={allTeachers} grades={allGrades} />
        )}
      </div>
      {/* table */}
      <DataTable columns={columns} data={data.classes} />
    </div>
  );
};

export default ClassListPage;
