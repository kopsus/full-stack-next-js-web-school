"use server";

import { revalidatePath } from "next/cache";
import { TeacherSchema } from "../formValidationSchemas/teacher";
import prisma from "../prisma";
import { responServerAction } from "./responServerActionType";
import { uploadImage } from "./upload-image";
import bcrypt from "bcryptjs";
import { deleteImage } from "./delete-image";

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

    let path = null;

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

    // cek apakah isi dari image, jika string kosong maka tidak ada gambar yang diupload
    const imageFile = image?.get("img") as File;
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
      await prisma.teacher.update({
        where: { id: teacher.id },
        data: { img: path },
      });
    }

    revalidatePath("/list/teachers");
    return responServerAction({
      statusSuccess: true,
      statusError: false,
      messageSuccess: "Berhasil membuat data guru",
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
    let path = null;

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
      },
    });

    // Handle image upload if provided
    const imageFile = image?.get("img") as File;
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

      // Update image path
      await prisma.teacher.update({
        where: { id },
        data: { img: path },
      });
    }

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
