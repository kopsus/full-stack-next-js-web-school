import ParentFormCreate from "@/components/forms/parent/ParentFormCreate";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CreateParentPage() {

    const session = await cookies().get("session")

    if (!session) {
        redirect("/login")
    }

    const students = await prisma.student.findMany()

    return (
        <ParentFormCreate students={students} />
    )
}
