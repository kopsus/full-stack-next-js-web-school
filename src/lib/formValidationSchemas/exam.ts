import { z } from "zod";

export const examSchema = z.object({
    title: z.string().min(1, { message: "Judul ujian diperlukan!" }),
    startTime: z.coerce.date({ message: "Waktu mulai diperlukan!" }),
    endTime: z.coerce.date({ message: "Waktu selesai diperlukan!" }),
    lessonId: z.number().min(1, { message: "Mata pelajaran diperlukan!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;