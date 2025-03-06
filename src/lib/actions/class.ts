"use server";

import { ClassSchema } from "../formValidationSchemas/class";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { responServerAction } from "./responServerActionType";

export const createClass = async (data: ClassSchema) => {
    try {
        await prisma.class.create({
            data: {
                name: data.name,
                capacity: data.capacity,
                gradeId: Number(data.gradeId),
                supervisorId: data.supervisorId ? Number(data.supervisorId) : null
            }
        });

        revalidatePath("/list/classes");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil membuat kelas",
        });
    } catch (error) {
        console.log(error);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal membuat kelas",
            data: null,
        });
    }
};

export const updateClass = async (id: number, data: ClassSchema) => {
    try {
        await prisma.class.update({
            where: { id },
            data: {
                name: data.name,
                capacity: data.capacity,
                gradeId: Number(data.gradeId),
                supervisorId: data.supervisorId ? Number(data.supervisorId) : null
            }
        });

        revalidatePath("/list/classes");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil mengubah kelas",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal mengubah kelas",
        });
    }
};

export const deleteClass = async (id: number) => {
    try {
        await prisma.class.delete({
            where: {
                id: id
            }
        });

        revalidatePath("/list/classes");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil menghapus kelas",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal menghapus kelas",
        });
    }
};
