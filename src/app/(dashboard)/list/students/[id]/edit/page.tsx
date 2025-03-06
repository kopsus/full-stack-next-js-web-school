import StudentFormUpdate from "@/components/forms/student/StudentFormUpdate"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function EditStudentPage({
    params,
}: {
    params: { id: string }
}) {
    const student = await prisma.student.findUnique({
        where: {
            id: Number(params.id)
        },
    })

    if (!student) {
        redirect("/list/students")
    }

    const classes = await prisma.class.findMany()
    const parents = await prisma.parent.findMany()
    const grades = await prisma.grade.findMany()

    return (
        <StudentFormUpdate classes={classes} parents={parents} grades={grades} defaultValues={student} />
    )
}
