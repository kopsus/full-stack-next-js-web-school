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
import { updateAnnouncement } from "@/lib/actions/announcement";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { announcementSchema } from "@/lib/formValidationSchemas/announcement";
import type { AnnouncementSchema } from "@/lib/formValidationSchemas/announcement";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Class, Announcement } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import dayjs from "dayjs";

export default function ButtonEditAnnouncement({ defaultValues, allClasses }: { defaultValues: Announcement, allClasses: Class[] }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const form = useForm<AnnouncementSchema>({
        resolver: zodResolver(announcementSchema),
        defaultValues: {
            title: defaultValues.title,
            description: defaultValues.description,
            date: defaultValues.date,
            classId: defaultValues.classId
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    async function onSubmit(values: AnnouncementSchema) {
        const result = await updateAnnouncement(defaultValues.id, values);
        if (result.success) {
            form.reset();
            toast.success(result.success.message);
            setOpen(false);
            router.push("/list/announcements");
        } else if (result.error) {
            toast.error(result.error.message);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <div className="w-full">
                    <Button variant="ghost" size="sm" className="w-full flex flex-row items-center justify-start gap-2">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Pengumuman</AlertDialogTitle>
                    <AlertDialogDescription className="hidden">
                        Isi formulir berikut untuk mengedit pengumuman. Pastikan semua data yang dimasukkan sudah benar.
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
                                                <FormLabel className="text-gray-700">Judul Pengumuman</FormLabel>
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
                                        name="classId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Kelas (Opsional)</FormLabel>
                                                <Select onValueChange={(value) => field.onChange(value === "umum" ? null : Number(value))} value={field.value?.toString() || "umum"}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Kelas" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="umum">Umum</SelectItem>
                                                        {allClasses.map((classItem) => (
                                                            <SelectItem key={classItem.id} value={classItem.id.toString()}>
                                                                {classItem.name}
                                                            </SelectItem>
                                                        ))}
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
