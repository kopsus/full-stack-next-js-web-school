"use server";

import { revalidatePath } from "next/cache";
import { ParentSchema } from "../formValidationSchemas/parent";
import prisma from "../prisma";
import { responServerAction } from "./responServerActionType";
import { uploadImage } from "./upload-image";
import bcrypt from "bcryptjs";

export const createParent = async (data: ParentSchema, image?: FormData) => {
    try {
        const checkUsername = await prisma.parent.findUnique({
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

        const parent = await prisma.parent.create({
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
                students: {
                    connect: (data.students || []).map((student) => ({ id: student })),
                },
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
            await prisma.parent.update({
                where: { id: parent.id },
                data: { img: path },
            });
        }

        revalidatePath("/list/parents");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil membuat data orang tua",
        });
    } catch (error) {
        console.log(error);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal membuat data orang tua",
            data: null,
        });
    }
};

export const updateParent = async (
    id: number,
    data: ParentSchema,
    image?: FormData
) => {
    try {
        let path = null;

        await prisma.parent.update({
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
                students: {
                    set: (data.students || []).map((student) => ({ id: student })),
                },
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

            await prisma.parent.update({
                where: { id },
                data: { img: path },
            });
        }

        revalidatePath("/list/parents");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil mengubah data orang tua",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal mengubah data orang tua",
        });
    }
};

export const deleteParent = async (id: number) => {
    try {
        // Hapus orang tua - relasi dengan student akan otomatis di-set null karena onDelete: SetNull
        await prisma.parent.delete({
            where: {
                id: id
            }
        });
        revalidatePath("/list/parents");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil menghapus data orang tua",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal menghapus data orang tua",
        });
    }
};
