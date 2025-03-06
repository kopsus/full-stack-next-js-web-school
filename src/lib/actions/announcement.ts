"use server";

import { AnnouncementSchema } from "../formValidationSchemas/announcement";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { responServerAction } from "./responServerActionType";

export const createAnnouncement = async (data: AnnouncementSchema) => {
    try {
        await prisma.announcement.create({
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                classId: data.classId ? Number(data.classId) : null
            }
        });

        revalidatePath("/list/announcements");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil membuat pengumuman",
        });
    } catch (error) {
        console.log(error);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal membuat pengumuman",
            data: null,
        });
    }
};

export const updateAnnouncement = async (id: number, data: AnnouncementSchema) => {
    try {
        await prisma.announcement.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                classId: data.classId ? Number(data.classId) : null
            }
        });

        revalidatePath("/list/announcements");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil mengubah pengumuman",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal mengubah pengumuman",
        });
    }
};

export const deleteAnnouncement = async (id: number) => {
    try {
        await prisma.announcement.delete({
            where: {
                id: id
            }
        });

        revalidatePath("/list/announcements");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil menghapus pengumuman",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal menghapus pengumuman",
        });
    }
};
