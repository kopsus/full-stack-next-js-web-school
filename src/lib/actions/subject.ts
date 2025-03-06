"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { responServerAction } from "./responServerActionType";
import { SubjectSchema } from "../formValidationSchemas/subject";

export const createSubject = async (data: SubjectSchema) => {
    try {
        await prisma.subject.create({
            data: {
                name: data.name,
                teachers: {
                    connect: data.teachers ? data.teachers.map((teacherId) => ({ id: Number(teacherId) })) : [],
                }
            }
        });

        revalidatePath("/list/subjects");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil membuat mata pelajaran",
        });
    } catch (error) {
        console.log(error);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal membuat mata pelajaran",
            data: null,
        });
    }
};

export const updateSubject = async (id: number, data: SubjectSchema) => {
    try {
        await prisma.subject.update({
            where: { id },
            data: {
                name: data.name,
                teachers: {
                    set: [], // Clear existing connections
                    connect: data.teachers ? data.teachers.map((teacherId) => ({ id: Number(teacherId) })) : [],
                }
            }
        });

        revalidatePath("/list/subjects");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil mengubah mata pelajaran",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal mengubah mata pelajaran",
        });
    }
};

export const deleteSubject = async (id: number) => {
    try {
        await prisma.subject.delete({
            where: {
                id: id
            }
        });

        revalidatePath("/list/subjects");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil menghapus mata pelajaran",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal menghapus mata pelajaran",
        });
    }
};