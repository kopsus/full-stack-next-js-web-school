"use server";

import { ProfileSchema } from "../formValidationSchemas/profile";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { responServerAction } from "./responServerActionType";
import { uploadImage } from "./upload-image";
import bcrypt from "bcryptjs";

export const updateProfile = async (
  id: number,
  role: string,
  data: ProfileSchema,
  image?: FormData
) => {
  try {
    let path = null;

    if (image?.get("img")) {
      const result = await uploadImage(image);
      if (result.error.status) {
        console.error("Upload Gagal:", result.error.message);
        return responServerAction({
          statusSuccess: false,
          statusError: true,
          messageError: result.error.message,
          data: null,
        });
      }
      path = result.data;
    }

    const updateData = {
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      blood_type: data.blood_type,
      sex: data.sex,
      birthday: data.birthday,
      ...(data.password && { password: bcrypt.hashSync(data.password, 10) }),
      role: data.role,
      ...(path && { img: path }),
      updated_at: new Date(),
    };

    let updatedProfile;
    switch (role) {
      case "STUDENT":
        updatedProfile = await prisma.student.update({
          where: { id },
          data: updateData,
        });
        break;
      case "TEACHER":
        updatedProfile = await prisma.teacher.update({
          where: { id },
          data: updateData,
        });
        break;
      case "PARENT":
        updatedProfile = await prisma.parent.update({
          where: { id },
          data: updateData,
        });
        break;
      case "ADMIN":
        updatedProfile = await prisma.admin.update({
          where: { id },
          data: updateData,
        });
        break;
      default:
        throw new Error("Role tidak dikenal");
    }

    revalidatePath("/profile");

    return responServerAction({
      statusSuccess: true,
      statusError: false,
      messageSuccess: "Berhasil mengubah profil",
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    return responServerAction({
      statusSuccess: false,
      statusError: true,
      messageError: "Gagal mengubah profil",
    });
  }
};
