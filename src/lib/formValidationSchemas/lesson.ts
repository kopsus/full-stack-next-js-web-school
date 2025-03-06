import { z } from "zod";

export type LessonSchema = z.infer<typeof lessonSchema>;

export const lessonSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: "Lesson name is required!" }),
    day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], {
        message: "Day is required!"
    }),
    startTime: z.coerce.date({ message: "Start time is required!" }),
    endTime: z.coerce.date({ message: "End time is required!" }),
    subjectId: z.coerce.number().min(1, { message: "Subject is required!" }),
    classId: z.coerce.number().min(1, { message: "Class is required!" }),
    teacherId: z.string().min(1, { message: "Teacher is required!" })
});