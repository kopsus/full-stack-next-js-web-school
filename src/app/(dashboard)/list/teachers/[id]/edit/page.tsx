import TeacherForm from "@/components/forms/teacher/TeacherFormCreate";
import TeacherFormUpdate from "@/components/forms/teacher/TeacherFormUpdate";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function EditTeacherPage({
  params,
}: {
  params: { id: string };
}) {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      subjects: true,
    },
  });

  if (!teacher) {
    redirect("/list/teachers");
  }

  const subjects = await prisma.subject.findMany();

  return <TeacherFormUpdate subjects={subjects} defaultValues={teacher} />;
}
