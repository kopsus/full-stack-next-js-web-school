import StudentFormCreate from "@/components/forms/student/StudentFormCreate";
import prisma from "@/lib/prisma";

export default async function CreateStudentPage() {
  const classes = await prisma.class.findMany();
  const parents = await prisma.parent.findMany();
  const grades = await prisma.grade.findMany();
  return (
    <StudentFormCreate classes={classes} parents={parents} grades={grades} />
  );
}
