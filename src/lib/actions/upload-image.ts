"use server";

import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { responServerAction } from "./responServerActionType";

export async function uploadImage(image: FormData) {
  try {
    const imageFile = image.get("img") as File;

    if (!imageFile) {
      throw new Error("Tidak ada file yang diunggah.");
    }

    if (!(imageFile instanceof File)) {
      throw new Error("File tidak valid.");
    }

    // Validasi ekstensi file
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = extname(imageFile.name).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      throw new Error(
        "Format gambar tidak didukung. Hanya JPG, PNG, dan WEBP diperbolehkan."
      );
    }

    // Validasi ukuran file
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
    if (imageFile.size > MAX_FILE_SIZE) {
      throw new Error("Ukuran gambar terlalu besar, maksimal 1MB.");
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    const uniqueFileName = `${uuidv4()}${ext}`;
    const uploadPath = join(uploadDir, uniqueFileName);

    // Kompresi & resize gambar sebelum disimpan
    const compressedBuffer = await sharp(buffer)
      .resize({ width: 800 }) // Resize dengan lebar maksimal 800px
      .toFormat("jpeg") // Ubah ke JPEG untuk ukuran lebih kecil
      .jpeg({ quality: 80 });

    await writeFile(uploadPath, compressedBuffer);

    return responServerAction({
      statusSuccess: true,
      statusError: false,
      messageSuccess: "Berhasil mengupload gambar",
      data: uniqueFileName,
    });
  } catch (error) {
    console.error("Upload Image Error:", error);
    return responServerAction({
      statusSuccess: false,
      statusError: true,
      messageError:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengupload.",
      data: null,
    });
  }
}
