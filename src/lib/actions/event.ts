"use server";

import { EventSchema } from "../formValidationSchemas/event";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { responServerAction } from "./responServerActionType";

export const createEvent = async (data: EventSchema) => {
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId ? Number(data.classId) : null,
      },
    });

    revalidatePath("/list/events");
    return responServerAction({
      statusSuccess: true,
      statusError: false,
      messageSuccess: "Berhasil membuat acara",
    });
  } catch (error) {
    console.log(error);
    return responServerAction({
      statusSuccess: false,
      statusError: true,
      messageError: "Gagal membuat acara",
      data: null,
    });
  }
};

export const updateEvent = async (id: number, data: EventSchema) => {
  try {
    await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId ? Number(data.classId) : null,
      },
    });

    revalidatePath("/list/events");
    return responServerAction({
      statusSuccess: true,
      statusError: false,
      messageSuccess: "Berhasil mengubah acara",
    });
  } catch (err) {
    console.log(err);
    return responServerAction({
      statusSuccess: false,
      statusError: true,
      messageError: "Gagal mengubah acara",
    });
  }
};

export const deleteEvent = async (id: number) => {
  try {
    await prisma.event.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/list/events");
    return responServerAction({
      statusSuccess: true,
      statusError: false,
      messageSuccess: "Berhasil menghapus acara",
    });
  } catch (err) {
    console.log(err);
    return responServerAction({
      statusSuccess: false,
      statusError: true,
      messageError: "Gagal menghapus acara",
    });
  }
};
