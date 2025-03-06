import prisma from "@/lib/prisma";

import { decrypt } from "@/lib/actions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import ButtonCreateSubject from "@/components/forms/subject/SubjectFormCreate";

const SubjectListPage = async () => {

  const session = await decrypt(cookies().get("session")?.value);

  if (!session) {
    redirect("/");
  }

  const role = session.role;

  const subjects = await prisma.subject.findMany({
    include: {
      teachers: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  
  const teachers = await prisma.teacher.findMany();

  const data = {
    subjects: subjects.map((subject) => ({
      ...subject,
      allTeachers: teachers,
    })),
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
        <h1 className="text-lg font-semibold">Data Mata Pelajaran</h1>
        {role === "ADMIN" && (
          <ButtonCreateSubject teachers={teachers} />
        )}
      </div>
      {/* table */}
      <DataTable columns={columns} data={data.subjects} />
    </div>
  );
};

export default SubjectListPage;
