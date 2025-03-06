import { z } from "zod";

export type AssignmentSchema = z.infer<typeof assignmentSchema>;

export const assignmentSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Title is required!" }),
    startDate: z.coerce.date({ message: "Start date is required!" }),
    dueDate: z.coerce.date({ message: "Due date is required!" }),
    lessonId: z.coerce.number({ message: "Lesson is required!" }),
});