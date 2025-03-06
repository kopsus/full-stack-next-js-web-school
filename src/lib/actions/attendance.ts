"use server";

import { AttendanceSchema } from "../formValidationSchemas/attandance";
import prisma from "../prisma";
import { responServerAction } from "./responServerActionType";
import { revalidatePath } from "next/cache";
export const createAttendance = async (data: AttendanceSchema) => {
    try {
        const { studentId, teacherId, lessonId, date, present } = data;
        const attendance = await prisma.attendance.create({
            data: {
                studentId: studentId ?? null,
                teacherId: teacherId ?? null,
                lessonId,
                date,
                present,
            }
        });
        revalidatePath("/list/attendance");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil membuat absensi",
            data: attendance,
        });
    } catch (err) {
        console.error(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal membuat absensi",
        });
    }
};

export const updateAttendance = async (id: number, data: AttendanceSchema) => {
    if (!id) {
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "ID absensi tidak ditemukan",
        });
    }
    try {
        const attendance = await prisma.attendance.update({
            where: { id: data.id },
            data: {
                present: data.present,
                date: data.date,
                studentId: data.studentId ?? undefined,
                teacherId: data.teacherId ?? undefined,
                lessonId: data.lessonId,
            }
        });
        revalidatePath("/list/attendance");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil mengubah absensi",
            data: attendance,
        });
    } catch (err) {
        console.error(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal mengubah absensi",
        });
    }
};

export const deleteAttendance = async (data: FormData) => {
    const id = data.get("id") as string;

    try {
        const attendance = await prisma.attendance.delete({
            where: { id: Number(id) }
        });
        revalidatePath("/list/attendance");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil menghapus absensi",
            data: attendance,
        });
    } catch (err) {
        console.error(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal menghapus absensi",
        });
    }
};
