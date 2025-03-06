"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useState } from "react";
import { financeSchema } from "@/lib/formValidationSchemas/finance";
import type { FinanceSchema } from "@/lib/formValidationSchemas/finance";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import dayjs from "dayjs";
import { responServerAction } from "@/lib/actions/responServerActionType";
import { createFinance } from "@/lib/actions/finance";

export default function ButtonCreateFinance() {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const form = useForm<FinanceSchema>({
        resolver: zodResolver(financeSchema),
        defaultValues: {
            title: "",
            description: "",
            date: new Date(),
            amount: 0,
            type: "EXPENSE"
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    async function onSubmit(values: FinanceSchema) {
        try {
            const result: responServerAction = await createFinance(values);
            if (result.success) {
                toast.success(result.success.message);
            } else {
                toast.error(result.error?.message ?? "Gagal menambahkan data keuangan");
            }
            form.reset();
            setOpen(false);
            router.push("/list/finance");
        } catch (error) {
            toast.error("Gagal menambahkan data keuangan");
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Keuangan
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Tambah Data Keuangan</AlertDialogTitle>
                    <AlertDialogDescription className="hidden">
                        Isi formulir berikut untuk menambahkan data keuangan baru. Pastikan semua data yang dimasukkan sudah benar.
                    </AlertDialogDescription>
                    <div className="mt-4">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex flex-col gap-6"
                            >
                                <div className="space-y-4 text-left">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Judul</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="border-gray-300 focus:border-blue-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Deskripsi</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        className="border-gray-300 focus:border-blue-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Tanggal</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        className="border-gray-300 focus:border-blue-500"
                                                        {...field}
                                                        value={dayjs(field.value).format("YYYY-MM-DD")}
                                                        onChange={(e) => field.onChange(new Date(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Jumlah</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        className="border-gray-300 focus:border-blue-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Tipe</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Tipe" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="INCOME">Pemasukan</SelectItem>
                                                        <SelectItem value="EXPENSE">Pengeluaran</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            form.reset();
                                            setOpen(false);
                                        }}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                                    >
                                        {isSubmitting ? "Menyimpan..." : "Simpan"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    );
}
