import { z } from "zod";

export type ProfileSchema = z.infer<typeof profileSchema>;

export const profileSchema = z.object({
    id: z.coerce.number().optional(),
    username: z.string(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    email: z.string().email(),
    phone: z.string().nullable(),
    address: z.string().nullable(),
    img: z.string().nullable(),
    blood_type: z.enum(["A", "B", "AB", "O"]).nullable(),
    birthday: z.date(),
    sex: z.enum(["MALE", "FEMALE"]),
    password: z.string().min(6, { message: "Password must be at least 6 characters!" }).optional(),
    role: z.enum(["ADMIN", "TEACHER", "STUDENT", "PARENT"]).optional()
});
