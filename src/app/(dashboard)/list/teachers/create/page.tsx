import TeacherFormCreate from "@/components/forms/teacher/TeacherFormCreate";
import prisma from "@/lib/prisma";


export default async function CreateTeacherPage() {
    const subjects = await prisma.subject.findMany();
    return (
        <TeacherFormCreate subjects={subjects} />
    )
}
