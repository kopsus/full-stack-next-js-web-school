import { z } from "zod";

export type EventSchema = z.infer<typeof eventSchema>;

export const eventSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Judul wajib diisi!" }),
    description: z.string().min(1, { message: "Deskripsi wajib diisi!" }),
    startTime: z.coerce.date({ message: "Waktu mulai wajib diisi!" }),
    endTime: z.coerce.date({ message: "Waktu selesai wajib diisi!" }),
    classId: z.coerce.number().nullable().optional(),
});