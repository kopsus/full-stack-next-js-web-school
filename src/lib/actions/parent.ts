"use server";

import { revalidatePath } from "next/cache";
import { ParentSchema } from "../formValidationSchemas/parent";
import prisma from "../prisma";
import { responServerAction } from "./responServerActionType";
import { uploadImage } from "./upload-image";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

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

    let imagePath = null;

    if (image) {
      const result = await uploadImage(image);
      if (result.error.status) {
        return responServerAction({
          statusError: true,
          statusSuccess: false,
          messageError: result.error.message,
        });
      }
      imagePath = result.data;
    }

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
        img: imagePath,
      },
    });

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
    // Ambil data lama
    const oldData = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!oldData) {
      return responServerAction({
        statusError: true,
        statusSuccess: false,
        messageError: "Data tidak ditemukan",
      });
    }

    let imagePath = oldData.img; // Default tetap pakai gambar lama

    // Jika ada image baru yang diunggah
    if (image && image.get("img")) {
      const result = await uploadImage(image);
      if (result.error.status) {
        return responServerAction({
          statusError: true,
          statusSuccess: false,
          messageError: result.error.message,
        });
      }

      // Hapus gambar lama jika ada
      if (oldData.img) {
        const oldImagePath = path.join(
          process.cwd(),
          "/var/www/uploads",
          oldData.img
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      imagePath = result.data; // Update dengan image baru
    }

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
        img: imagePath,
      },
    });

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
        id: id,
      },
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
