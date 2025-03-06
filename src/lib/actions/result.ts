"use server";

import { ResultSchema } from "../formValidationSchemas/result"; 
import prisma from "../prisma";
import { responServerAction } from "./responServerActionType"; 
import { revalidatePath } from "next/cache"; 

export const createResult = async (data: ResultSchema) => {
    try {
        const result = await prisma.result.create({
            data: {
                score: data.score,
                studentId: Number(data.studentId),
                examId: data.examId,
                assignmentId: data.assignmentId,
            },
        });

        revalidatePath("/list/results");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil membuat hasil",
        });
    } catch (err) {
        console.error(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal membuat hasil",
        });
    }
};

export const updateResult = async (id: number, data: ResultSchema) => {
    if (!id) {
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "ID tidak valid",
        });
    }
    try {
        await prisma.result.update({
            where: { id },
            data: {
                score: data.score,
                studentId: Number(data.studentId),
                examId: data.examId ? Number(data.examId) : null,
                assignmentId: data.assignmentId ? Number(data.assignmentId) : null,
            },
        });

        revalidatePath("/list/results");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil mengubah hasil",
        });
    } catch (err) {
        console.error(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal mengubah hasil",
        });
    }
};

export const deleteResult = async (data: FormData) => {
    const id = data.get("id") as string;

    if (!id) {
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "ID tidak valid",
        });
    }

    try {
        await prisma.result.delete({
            where: { id: Number(id) },
        });

        revalidatePath("/list/results");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil menghapus hasil",
        });
    } catch (err) {
        console.error(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal menghapus hasil",
        });
    }
};
