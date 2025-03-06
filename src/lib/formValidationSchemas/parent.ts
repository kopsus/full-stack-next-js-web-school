import { z } from "zod";

export type ParentSchema = z.infer<typeof parentSchema>;
export const parentSchema = z.object({
    id: z.coerce.number().optional(),
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long!" })
        .max(20, { message: "Username must be at most 20 characters long!" })
        .regex(/^[a-z0-9]+$/, { message: "Username can only contain lowercase letters and numbers, no spaces or special characters!" })
        .transform(val => val.toLowerCase()),
    first_name: z.string().min(1, { message: "First name is required!" }),
    last_name: z.string().min(1, { message: "Last name is required!" }),
    email: z.string().email({ message: "Invalid email address!" }),
    phone: z.string().regex(/^(\+62|62|0)\d+$/, { message: "Phone number must start with 0, 62, or +62!" }).optional(),
    address: z.string().optional(),
    img: z.string().optional(),
    blood_type: z.enum(["A", "B", "AB", "O"]).optional(),
    birthday: z.coerce.date({ message: "Birthday is required!" }),
    sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long!" }).or(z.literal("")),
    students: z.array(z.number()).optional(),
});