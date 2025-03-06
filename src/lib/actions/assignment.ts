"use server";

import { AssignmentSchema } from "../formValidationSchemas/assignment";
import prisma from "../prisma";
import { responServerAction } from "./responServerActionType";
import { revalidatePath } from "next/cache";

export const createAssignment = async (data: AssignmentSchema) => {
    try {
        await prisma.assignment.create({
            data: {
                title: data.title,
                startDate: data.startDate,
                dueDate: data.dueDate,
                lessonId: data.lessonId,
            }
        });

        revalidatePath("/list/assignments");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil membuat tugas",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal membuat tugas",
        });
    }
};

export const updateAssignment = async (id: number, data: AssignmentSchema) => {
    if (!id) {
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "ID tugas tidak ditemukan",
        });
    }

    try {
        await prisma.assignment.update({
            where: { id },
            data: {
                title: data.title,
                startDate: data.startDate,
                dueDate: data.dueDate,
                lessonId: data.lessonId,
            }
        });

        revalidatePath("/list/assignments");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil mengubah tugas",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal mengubah tugas",
        });
    }
};

export const deleteAssignment = async (id: number) => {
    try {
        await prisma.assignment.delete({
            where: { id }
        });

        revalidatePath("/list/assignments");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil menghapus tugas",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal menghapus tugas",
        });
    }
};

export const uploadAssignmentAnswer = async (id: number, formData: FormData) => {
    const file = formData.get('file') as File;
    
    if (!(file instanceof File)) {
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal mengupload file, file tidak valid",
            data: null
        });
    }

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_FILE_SIZE) {
        return responServerAction({
            statusSuccess: false, 
            statusError: true,
            messageError: "Ukuran file terlalu besar, maksimal 2MB",
            data: null
        });
    }

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const fileType = file.name.split('.').pop()?.toLowerCase() || '';

        // Create or update result and answer
        await prisma.result.upsert({
            where: {
                assignmentId_studentId: {
                    assignmentId: id,
                    studentId: 1 // You need to get actual studentId from session
                }
            },
            create: {
                assignmentId: id,
                studentId: 1, // You need to get actual studentId from session
                score: 0,
                answer: {
                    create: {
                        answer: base64,
                        fileType: fileType
                    }
                }
            },
            update: {
                answer: {
                    upsert: {
                        create: {
                            answer: base64,
                            fileType: fileType
                        },
                        update: {
                            answer: base64,
                            fileType: fileType
                        }
                    }
                }
            }
        });

        revalidatePath("/list/assignments");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil mengupload jawaban",
            data: null
        });

    } catch (error) {
        console.log(error);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal mengupload jawaban: " + (error as Error).message,
            data: null
        });
    }
};