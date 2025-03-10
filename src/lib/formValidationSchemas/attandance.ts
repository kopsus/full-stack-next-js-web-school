import { z } from "zod";

export const attendanceSchema = z.object({
  id: z.coerce.number().optional(),
  studentId: z.coerce
    .number()
    .min(1, { message: "Student is required!" })
    .nullable(),
  teacherId: z.coerce
    .number()
    .min(1, { message: "Teacher is required!" })
    .nullable(),
  lessonId: z.coerce.number().min(1, { message: "Lesson is required!" }),
  date: z.coerce.date({ message: "Date is required!" }),
  present: z.enum(["HADIR", "ALFA", "PERMISSION", "SICK"]).default("HADIR"),
  information: z.coerce.string().optional(),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;
