import { z } from "zod";

export const formLoginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Minimal karakter username adalah 3 karakter" })
    .max(50, { message: "Maksimal karakter username adalah 50" })
    .regex(/^[a-z0-9]+$/, {
      message: "Username hanya boleh mengandung huruf kecil dan angka",
    }),
  password: z
    .string()
    .min(3, { message: "Minimal karakter password adalah 3 karakter" })
    .max(50, { message: "Maksimal karakter password adalah 50" }),
});

export type FormLoginSchema = z.infer<typeof formLoginSchema>;
