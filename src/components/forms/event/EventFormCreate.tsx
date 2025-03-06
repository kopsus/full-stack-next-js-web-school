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
import { createEvent } from "@/lib/actions/event";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useState } from "react";
import { eventSchema } from "@/lib/formValidationSchemas/event";
import type { EventSchema } from "@/lib/formValidationSchemas/event";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Class } from "@prisma/client";
import dayjs from "dayjs";
import { Textarea } from "@/components/ui/textarea";

export default function ButtonCreateEvent({ allClasses }: { allClasses: Class[] }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const form = useForm<EventSchema>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: "",
            description: "",
            startTime: new Date(),
            endTime: new Date(),
            classId: null
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    async function onSubmit(values: EventSchema) {
        const result = await createEvent(values);
        if (result.success) {
            form.reset();
            toast.success(result.success.message);
            setOpen(false);
            router.push("/list/events");
        } else if (result.error) {
            toast.error(result.error.message);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Acara
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Tambah Acara</AlertDialogTitle>
                    <AlertDialogDescription className="hidden">
                        Isi formulir berikut untuk menambahkan acara baru. Pastikan semua data yang dimasukkan sudah benar.
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
                                                <FormLabel className="text-gray-700">Judul Acara</FormLabel>
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="startTime"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700">Waktu Mulai</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="datetime-local"
                                                            className="border-gray-300 focus:border-blue-500"
                                                            {...field}
                                                            value={dayjs(field.value).format("YYYY-MM-DDTHH:mm")}
                                                            onChange={(e) => field.onChange(new Date(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="endTime"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700">Waktu Selesai</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="datetime-local"
                                                            className="border-gray-300 focus:border-blue-500"
                                                            {...field}
                                                            value={dayjs(field.value).format("YYYY-MM-DDTHH:mm")}
                                                            onChange={(e) => field.onChange(new Date(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="classId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Kelas (Opsional)</FormLabel>
                                                <Select onValueChange={(value) => field.onChange(value ? Number(value) : null)} value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Kelas" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
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
