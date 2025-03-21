"use server";

import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { responServerAction } from "./responServerActionType";

export async function uploadImage(image: FormData) {
  try {
    const imageFile = image.get("img") as File;

    if (!(imageFile instanceof File)) {
      throw new Error("File tidak valid");
    }

    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
    if (imageFile.size > MAX_FILE_SIZE) {
      throw new Error("Ukuran gambar terlalu besar, maksimal 1MB");
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    const ext = extname(imageFile.name).toLowerCase();
    const uniqueFileName = `${uuidv4()}${ext}`;
    const uploadPath = join(uploadDir, uniqueFileName);

    const compressedBuffer = await sharp(buffer)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toBuffer();

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
        error instanceof Error ? error.message : "Terjadi kesalahan",
      data: null,
    });
  }
}
