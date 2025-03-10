import { z } from "zod";

export type FinanceSchema = z.infer<typeof financeSchema>;

export const financeSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Judul harus diisi!" }),
  description: z.string().min(1, { message: "Deskripsi harus diisi!" }),
  date: z.coerce.date({ message: "Tanggal harus diisi!" }),
  amount: z.coerce.number().min(1, { message: "Jumlah harus diisi!" }),
  type: z
    .enum(["INCOME", "EXPENSE"], {
      errorMap: () => ({ message: "Tipe harus dipilih!" }),
    })
    .default("EXPENSE"),
});
