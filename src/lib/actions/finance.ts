"use server";

import { FinanceSchema } from "../formValidationSchemas/finance";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { responServerAction } from "./responServerActionType";

export const createFinance = async (data: FinanceSchema) => {
    try {
        await prisma.finance.create({
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                amount: data.amount,
                type: data.type
            }
        });

        revalidatePath("/list/finance");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil membuat data keuangan",
        });
    } catch (error) {
        console.log(error);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal membuat data keuangan",
            data: null,
        });
    }
};

export const updateFinance = async (id: number, data: FinanceSchema) => {
    try {
        await prisma.finance.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                amount: data.amount,
                type: data.type
            }
        });

        revalidatePath("/list/finance");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil mengubah data keuangan",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal mengubah data keuangan",
        });
    }
};

export const deleteFinance = async (id: number) => {
    try {
        await prisma.finance.delete({
            where: {
                id: id
            }
        });

        revalidatePath("/list/finance");
        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil menghapus data keuangan",
        });
    } catch (err) {
        console.log(err);
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal menghapus data keuangan",
        });
    }
};
