"use server";

import { revalidatePath } from "next/cache";
import { TeacherSchema } from "../formValidationSchemas/teacher";
import prisma from "../prisma";
import { responServerAction } from "./responServerActionType";
import { uploadImage } from "./upload-image";
import bcrypt from "bcryptjs";
import { deleteImage } from "./delete-image";
import path from "path";
import fs from "fs";

export const createTeacher = async (data: TeacherSchema, image?: FormData) => {
  try {
    const checkUsername = await prisma.teacher.findUnique({
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

    const teacher = await prisma.teacher.create({
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
        img: imagePath,
        subjects: {
          connect: data.subjects
            ? data.subjects.map((subjectId) => ({ id: Number(subjectId) }))
            : [],
        },
        classes: {
          connect: data.classes
            ? data.classes.map((classId) => ({ id: Number(classId) }))
            : [],
        },
      },
    });

    revalidatePath("/list/teachers");
    return responServerAction({
      statusSuccess: true,
      statusError: false,
      messageSuccess: "Berhasil membuat data guru",
      data: teacher,
    });
  } catch (error) {
    console.log(error);
    return responServerAction({
      statusSuccess: false,
      statusError: true,
      messageError: "Gagal membuat data guru",
      data: null,
    });
  }
};

export const updateTeacher = async (
  id: number,
  data: TeacherSchema,
  image?: FormData
) => {
  try {
    // Ambil data produk lama
    const oldProduct = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!oldProduct) {
      return responServerAction({
        statusSuccess: false,
        statusError: true,
        messageError: "Produk tidak ditemukan",
      });
    }

    let imagePath = oldProduct.img; // Default tetap pakai gambar lama

    // Jika ada image baru yang diunggah
    if (image) {
      const result = await uploadImage(image);
      if (result.error.status) {
        return responServerAction({
          statusSuccess: false,
          statusError: true,
          messageError: result.error.message,
        });
      }

      // Hapus gambar lama jika ada
      if (oldProduct.img) {
        const oldImagePath = path.join(
          process.cwd(),
          "/var/www/uploads",
          oldProduct.img
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      imagePath = result.data; // Update dengan image baru
    }

    // Update teacher data
    await prisma.teacher.update({
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
        subjects: {
          set: [], // Clear existing connections
          connect: data.subjects
            ? data.subjects.map((subjectId) => ({ id: Number(subjectId) }))
            : [],
        },
        classes: {
          set: [], // Clear existing connections
          connect: data.classes
            ? data.classes.map((classId) => ({ id: Number(classId) }))
            : [],
        },
        img: imagePath,
      },
    });

    revalidatePath("/list/teachers");
    return responServerAction({
      statusSuccess: true,
      statusError: false,
      messageSuccess: "Berhasil mengubah data guru",
    });
  } catch (err) {
    console.log(err);
    return responServerAction({
      statusSuccess: false,
      statusError: true,
      messageError: "Gagal mengubah data guru",
    });
  }
};

export const deleteTeacher = async (id: number) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: {
        id: id,
      },
    });

    // jika gambar tidak kosong maka hapus gambar
    if (
      teacher?.img !== null &&
      teacher?.img !== undefined &&
      teacher?.img !== ""
    ) {
      await deleteImage(teacher.img);
    }

    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/list/teachers");
    return responServerAction({
      statusSuccess: true,
      statusError: false,
      messageSuccess: "Berhasil menghapus data guru",
    });
  } catch (err) {
    console.log(err);
    return responServerAction({
      statusSuccess: false,
      statusError: true,
      messageError: "Gagal menghapus data guru",
    });
  }
};
