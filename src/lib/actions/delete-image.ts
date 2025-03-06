"use server";

import { unlink } from 'fs/promises';
import { join } from 'path';
import { responServerAction } from './responServerActionType';

export async function deleteImage(imageName: string) {
    try {
        if (!imageName) {
            return responServerAction({
                statusSuccess: false,
                statusError: true,
                messageError: "Nama file gambar tidak valid",
                data: null
            });
        }

        const uploadDir = join(process.cwd(), 'public/uploads');
        const filePath = join(uploadDir, imageName);

        await unlink(filePath);

        return responServerAction({
            statusSuccess: true,
            statusError: false,
            messageSuccess: "Berhasil menghapus gambar",
            data: null
        });

    } catch (error) {
        return responServerAction({
            statusSuccess: false,
            statusError: true,
            messageError: "Gagal menghapus gambar: " + (error as Error).message,
            data: null
        });
    }
}
