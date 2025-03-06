import prisma from "@/lib/prisma";

import { decrypt } from "@/lib/actions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Role } from "@prisma/client";
const StudentListPage = async () => {

  const session = await decrypt(cookies().get("session")?.value);

  if (!session) {
    redirect("/");
  }

  const role = session.role;

  const students = await prisma.student.findMany({
    include: {
      class: true,
      parent: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  const studentsWithRole = students.map(student => ({
    ...student,
    roleLogin: session.role as Role
  }));

  const classes = await prisma.class.findMany();

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex md:flex-row flex-col justify-between gap-2 md:items-center">
        <h1 className="text-lg font-semibold">Data Siswa</h1>
        {(role === "ADMIN") && (
          <Button asChild className="mb-2">
            <Link href="/list/students/create">
              <Plus />
              Tambah Siswa
            </Link>
          </Button>
        )}
      </div>
      {/* table */}
      <DataTable columns={columns} data={studentsWithRole} classes={classes} />
    </div>
  );
};

export default StudentListPage;
