import prisma from "@/lib/prisma";

import { decrypt } from "@/lib/actions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ButtonCreateLesson from "@/components/forms/lesson/LessonFormCreate";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Prisma, Role } from "@prisma/client";

const LessonListPage = async () => {
  const session = await decrypt(cookies().get("session")?.value);

  if (!session) {
    redirect("/");
  }

  const role = session.role;

  const queryTacher = {
    where: {
      teacherId: role === "ADMIN" ? undefined : Number(session.id),
    },
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
    include: {
      class: true,
      teacher: true,
      subject: true,
    },
  };

  const queryAdmin = {
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
    include: {
      class: true,
      teacher: true,
      subject: true,
    },
  };

  const lessons = await prisma.lesson.findMany({
    ...(role === "ADMIN" ? queryAdmin : queryTacher),
  });

  const allTeachers = await prisma.teacher.findMany();
  const allClasses = await prisma.class.findMany();
  const allSubjects = await prisma.subject.findMany();

  const data = {
    lessons: lessons.map((lessonItem) => ({
      ...lessonItem,
      allTeachers: allTeachers,
      allClasses: allClasses,
      roleLogin: role as Role,
    })),
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
        <h1 className="text-lg font-semibold">Data Pelajaran</h1>
        {role === "ADMIN" ||
          (role === "TEACHER" && (
            <ButtonCreateLesson
              teachers={allTeachers}
              classes={allClasses}
              subjects={allSubjects}
            />
          ))}
      </div>
      {/* table */}
      <DataTable columns={columns} data={data.lessons} />
    </div>
  );
};

export default LessonListPage;
