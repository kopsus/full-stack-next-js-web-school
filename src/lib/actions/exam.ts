"use server";

import { ExamSchema } from "../formValidationSchemas/exam";
import prisma from "../prisma";
import { responServerAction } from "./responServerActionType";
import { revalidatePath } from "next/cache";

export const createExam = async (data: ExamSchema) => {
    try {
        await prisma.exam.create({
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                lessonId: Number(data.lessonId)
            }
        });

        revalidatePath("/list/exams");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil membuat ujian",
        });
    } catch (error) {
        console.log(error);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal membuat ujian",
            data: null,
        });
    }
};

export const updateExam = async (id: number, data: ExamSchema) => {
    try {
        await prisma.exam.update({
            where: { id },
            data: {
                title: data.title,
                startTime: data.startTime,
                endTime: data.endTime,
                lessonId: Number(data.lessonId)
            }
        });

        revalidatePath("/list/exams");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil mengubah ujian",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal mengubah ujian",
        });
    }
};

export const deleteExam = async (id: number) => {
    try {
        await prisma.exam.delete({
            where: {
                id: id
            }
        });

        revalidatePath("/list/exams");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil menghapus ujian",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal menghapus ujian",
        });
    }
};