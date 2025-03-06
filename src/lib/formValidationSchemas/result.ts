import { z } from "zod";
export type ResultSchema = z.infer<typeof resultSchema>;

export const resultSchema = z.object({
    id: z.coerce.number().optional(),
    score: z.coerce.number().min(0, { message: "Score must be at least 0!" }),
    studentId: z.string().min(1, { message: "Student is required!" }),
    examId: z.coerce.number().optional(),
    assignmentId: z.coerce.number().optional(),
});