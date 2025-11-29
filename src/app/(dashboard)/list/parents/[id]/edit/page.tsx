import ParentFormUpdate from "@/components/forms/parent/ParentFormUpdate";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function EditParentPage({
  params,
}: {
  params: { id: string };
}) {
  const parent = await prisma.parent.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      students: true,
    },
  });

  if (!parent) {
    redirect("/list/parents");
  }

  const students = await prisma.student.findMany();

  const studentIds = parent.students
    ? parent.students.map((student) => student.id)
    : [];

  return (
    <ParentFormUpdate
      students={students}
      defaultValues={{ ...parent, students: studentIds }}
    />
  );
}
