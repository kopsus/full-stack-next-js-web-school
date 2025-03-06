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
import { z } from "zod";
import { toast } from "react-toastify";
import { updateSubject } from "@/lib/actions/subject";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Teacher } from "@prisma/client";
import CustomSearchableInputTeacher from "@/components/CustomSearchableInputTeacher";
import { useState } from "react";

const subjectSchema = z.object({
    name: z.string().min(1, "Nama mata pelajaran harus diisi"),
    teachers: z.array(z.string()).default([]),
});

interface ButtonEditSubjectProps {
    teachers: Teacher[];
    subjectId: number;
    defaultValues: {
        name: string;
        teachers: string[];
    };
}

export default function ButtonEditSubject({ teachers, subjectId, defaultValues }: ButtonEditSubjectProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof subjectSchema>>({
        resolver: zodResolver(subjectSchema),
        defaultValues: {
            name: defaultValues.name,
            teachers: defaultValues.teachers,
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    async function onSubmit(values: z.infer<typeof subjectSchema>) {
        const result = await updateSubject(subjectId, {
            ...values,
            teachers: values.teachers || [],
        });
        if (result.success) {
            toast.success(result.success.message);
            setOpen(false);
            router.push("/list/subjects");
        } else if (result.error) {
            toast.error(result.error.message);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full flex flex-row items-center justify-start gap-2">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Mata Pelajaran</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex flex-col gap-6 mt-4"
                            >
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Nama Mata Pelajaran</FormLabel>
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

                                    <CustomSearchableInputTeacher
                                        teachers={teachers}
                                        form={form}
                                        defaultValues={defaultValues.teachers}
                                    />
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
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
                    </AlertDialogDescription>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    );
}