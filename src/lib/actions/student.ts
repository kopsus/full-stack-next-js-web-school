"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { StudentSchema } from "../formValidationSchemas/student";
import { responServerAction } from "./responServerActionType";
import { uploadImage } from "./upload-image";
import bcrypt from "bcryptjs";

export const createStudent = async (data: StudentSchema, image?: FormData) => {
    try {
        const checkUsername = await prisma.student.findUnique({
            where: {
                username: data.username,
            },
        });

        if (checkUsername) {
            return responServerAction({
                statusSuccess: false,
                statusError: true,
                messageError: "Username sudah ada",
                data: null,
            });
        }

        let path = null;

        const student = await prisma.student.create({
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                blood_type: data.blood_type,
                sex: data.sex,
                username: data.username,
                password: bcrypt.hashSync(data.password, 10),
                birthday: data.birthday,
                parentId: data.parentId,
                classId: data.classId,
                gradeId: data.gradeId
            }
        });

        const imageFile = image?.get('img') as File;
        if (imageFile) {
            const result = await uploadImage(image!);
            if (result.error?.status) {
                return responServerAction({
                    statusSuccess: false,
                    statusError: true,
                    messageError: result.error.message,
                    data: null,
                });
            }
            path = result.data as string;
        }

        if (path !== null) {
            await prisma.student.update({
                where: { id: student.id },
                data: { img: path },
            });
        }

        revalidatePath("/list/students");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil membuat data siswa",
        });
    } catch (error) {
        console.log(error);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal membuat data siswa",
            data: null,
        });
    }
};

export const updateStudent = async (
    id: number,
    data: StudentSchema,
    image?: FormData
) => {
    try {
        let path = null;

        await prisma.student.update({
            where: { id },
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                blood_type: data.blood_type,
                sex: data.sex,
                username: data.username,
                ...(data.password && { password: bcrypt.hashSync(data.password, 10) }),
                birthday: data.birthday,
                parentId: data.parentId,
                classId: data.classId,
                gradeId: data.gradeId
            }
        });

        const imageFile = image?.get('img') as File;
        if (imageFile) {
            const result = await uploadImage(image!);
            if (result.error?.status) {
                return responServerAction({
                    statusSuccess: false,
                    statusError: true,
                    messageError: result.error.message,
                    data: null,
                });
            }
            path = result.data as string;

            await prisma.student.update({
                where: { id },
                data: { img: path },
            });
        }

        revalidatePath("/list/students");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil mengubah data siswa",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal mengubah data siswa",
        });
    }
};

export const deleteStudent = async (id: number) => {
    try {
        await prisma.student.delete({
            where: {
                id: id
            }
        });
        revalidatePath("/list/students");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil menghapus data siswa",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal menghapus data siswa",
        });
    }
};
