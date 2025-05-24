"use server";

import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { responServerAction } from "./responServerActionType";

export async function uploadImage(image: FormData) {
  const imageFile = image.get("image") as File;

  if (!(imageFile instanceof File)) {
    return responServerAction({
      statusError: true,
      messageError: "Gagal mengupload gambar, file tidak valid",
      data: null,
    });
  }

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
  if (imageFile.size > MAX_FILE_SIZE) {
    return responServerAction({
      statusError: true,
      messageError: "Ukuran gambar terlalu besar, maksimal 1MB",
      data: null,
    });
  }

  try {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = "/var/www/uploads";
    await mkdir(uploadDir, { recursive: true });

    // Ekstensi file (misalnya .jpg, .png)
    const ext = extname(imageFile.name).toLowerCase();
    // Nama unik menggunakan UUID
    const uniqueFileName = `${uuidv4()}${ext}`;
    const uploadPath = join(uploadDir, uniqueFileName);

    // Menggunakan sharp untuk mengompres gambar sebelum menyimpan
    const compressedBuffer = await sharp(buffer)
      .resize({ width: 800 }) // Resize agar lebih kecil (opsional)
      .jpeg({ quality: 80 }) // Kurangi kualitas untuk menghemat ukuran
      .toBuffer();

    await writeFile(uploadPath, compressedBuffer);

    return responServerAction({
      statusSuccess: true,
      messageSuccess: "Berhasil mengupload gambar",
      data: uniqueFileName,
    });
  } catch (error) {
    return responServerAction({
      statusError: true,
      messageError: "Gagal mengupload gambar: " + (error as Error).message,
      data: null,
    });
  }
}
