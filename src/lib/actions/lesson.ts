"use server";

import { LessonSchema } from "../formValidationSchemas/lesson";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { responServerAction } from "./responServerActionType";

export const createLesson = async (data: LessonSchema) => {
    try {
        await prisma.lesson.create({
            data: {
                name: data.name,
                day: data.day,
                startTime: data.startTime,
                endTime: data.endTime,
                subjectId: Number(data.subjectId),
                classId: Number(data.classId),
                teacherId: Number(data.teacherId)
            }
        });

        revalidatePath("/list/lessons");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil membuat pelajaran",
        });
    } catch (error) {
        console.log(error);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal membuat pelajaran",
            data: null,
        });
    }
};

export const updateLesson = async (id: number, data: LessonSchema) => {
    try {
        await prisma.lesson.update({
            where: { id },
            data: {
                name: data.name,
                day: data.day,
                startTime: data.startTime,
                endTime: data.endTime,
                subjectId: Number(data.subjectId),
                classId: Number(data.classId),
                teacherId: Number(data.teacherId)
            }
        });

        revalidatePath("/list/lessons");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil mengubah pelajaran",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal mengubah pelajaran",
        });
    }
};

export const deleteLesson = async (id: number) => {
    try {
        await prisma.lesson.delete({
            where: {
                id: id
            }
        });

        revalidatePath("/list/lessons");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil menghapus pelajaran",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal menghapus pelajaran",
        });
    }
};
