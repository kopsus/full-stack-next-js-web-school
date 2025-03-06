import prisma from "@/lib/prisma";

import { decrypt } from "@/lib/actions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Role } from "@prisma/client";
const TeacherListPage = async () => {

  const session = await decrypt(cookies().get("session")?.value);

  if (!session) {
    redirect("/");
  }

  const role = session.role;

  const teachers = await prisma.teacher.findMany({
    include: {
      classes: true,
      subjects: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  const data = teachers.map((teacher) => ({
    ...teacher,
    roleLogin: role as Role,
  }));

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex md:flex-row flex-col justify-between gap-2 md:items-center">
        <h1 className="text-lg font-semibold">Data Guru</h1>
        {role === "ADMIN" && (
          <Button asChild className="mb-2">
            <Link href="/list/teachers/create">
              <Plus />
              Tambah Guru
            </Link>
          </Button>
        )}
      </div>
      {/* table */}
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default TeacherListPage;
