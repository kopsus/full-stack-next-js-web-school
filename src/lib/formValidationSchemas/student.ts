import { z } from "zod";

export type StudentSchema = z.infer<typeof studentSchema>;
export const studentSchema = z.object({
    id: z.coerce.number().optional(),
    username: z
        .string()
        .min(3, { message: "Username minimal 3 karakter!" })
        .regex(/^[a-z0-9]+$/, { message: "Username hanya boleh mengandung huruf kecil dan angka!" }),
    password: z.string().min(8, { message: "Password minimal 8 karakter!" }).or(z.literal("")),
    first_name: z.string().default(""),
    last_name: z.string().default(""),
    email: z.string().email({ message: "Format email tidak valid!" }),
    phone: z.string().regex(/^(\+62|62|0)\d+$/, { message: "Nomor telepon harus diawali dengan 0, 62, atau +62!" }).default(""),
    address: z.string().default(""),
    img: z.string().default(""),
    blood_type: z.enum(["A", "B", "AB", "O"], { message: "Golongan darah harus dipilih!" }).default("A"),
    birthday: z.date(),
    sex: z.enum(["MALE", "FEMALE"], { message: "Jenis kelamin harus dipilih!" }),
    role: z.enum(["ADMIN", "TEACHER", "STUDENT", "PARENT"]).default("STUDENT"),
    parentId: z.coerce.number().min(1, { message: "Parent harus dipilih!" }),
    classId: z.coerce.number().min(1, { message: "Kelas harus dipilih!" }),
    gradeId: z.coerce.number().min(1, { message: "Grade harus dipilih!" })
});