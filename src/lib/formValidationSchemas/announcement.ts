import { z } from "zod";

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

export const announcementSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Judul harus diisi!" }),
    description: z.string().min(1, { message: "Deskripsi harus diisi!" }), 
    date: z.coerce.date({ message: "Tanggal harus diisi!" }),
    classId: z.coerce.number().nullable().optional(),
});