"use server";

import { FormLoginSchema } from "../formValidationSchemas/login";
import { createSession } from "./create-session";
import { responServerAction } from "./responServerActionType";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function login(values: FormLoginSchema) {
  const { username, password } = values;

  // cek apakah terdapat data yang dikirim
  if (!values) {
    return responServerAction({
      statusError: true,
      statusSuccess: false,
      messageError: "Username dan password harus diisi",
    });
  }

  try {
    // cek di semua tabel untuk mencari username
    const adminUser = await prisma.admin.findUnique({
      where: { username },
    });

    const teacherUser = await prisma.teacher.findUnique({
      where: { username },
    });

    const studentUser = await prisma.student.findUnique({
      where: { username },
    });

    const parentUser = await prisma.parent.findUnique({
      where: { username },
    });

    // gabungkan semua hasil pencarian
    const user = adminUser || teacherUser || studentUser || parentUser;

    // jika username tidak ditemukan di semua tabel
    if (!user) {
      return responServerAction({
        statusError: true,
        statusSuccess: false,
        messageError: "Username tidak ditemukan",
      });
    }

    // validate hash password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // cek password
    if (!isPasswordValid) {
      return responServerAction({
        statusError: true,
        statusSuccess: false,
        messageError: "Username atau password salah",
      });
    }

    // generate session
    const session = await createSession(user.id.toString(), user.role);

    return responServerAction({
      statusSuccess: true,
      statusError: false,
      messageSuccess: "Login berhasil",
      data: user,
    });
  } catch (error) {
    return responServerAction({
      statusError: true,
      statusSuccess: false,
      messageError: "Terjadi kesalahan",
    });
  }
}
