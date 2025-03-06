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
import { createAssignment } from "@/lib/actions/assignment"; // Assuming a similar create function exists
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { assignmentSchema } from "@/lib/formValidationSchemas/assignment";
import type { AssignmentSchema } from "@/lib/formValidationSchemas/assignment";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";
import { Lesson, Class, Subject } from "@prisma/client";

export default function ButtonCreateAssignment({ allLessons, allClasses, allSubjects }: { allLessons: Lesson[], allClasses: Class[], allSubjects: Subject[] }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const form = useForm<AssignmentSchema>({
        resolver: zodResolver(assignmentSchema),
        defaultValues: {
            title: "",
            startDate: new Date(),
            dueDate: new Date(),
            lessonId: 0,
        },
    });

    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
    const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);

    const isSubmitting = form.formState.isSubmitting;

    useEffect(() => {
        if (selectedClassId && selectedSubjectId) {
            const lessons = allLessons.filter(lesson =>
                lesson.classId === selectedClassId && lesson.subjectId === selectedSubjectId
            );
            setFilteredLessons(lessons);
            form.setValue("lessonId", 0); // Reset lesson selection
        } else {
            setFilteredLessons([]);
        }
    }, [selectedClassId, selectedSubjectId, allLessons, form]);

    async function onSubmit(values: AssignmentSchema) {
        const result = await createAssignment(values);
        if (result.success) {
            toast.success(result.success.message);
            setOpen(false);
            router.push("/list/assignments");
        } else if (result.error) {
            toast.error(result.error.message);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Tugas
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-4xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Tambah Tugas</AlertDialogTitle>
                    <AlertDialogDescription className="hidden">
                        Isi formulir berikut untuk menambahkan tugas baru. Pastikan semua data yang dimasukkan sudah benar.
                    </AlertDialogDescription>
                    <div className="mt-4">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex flex-col gap-2"
                            >
                                <div className="space-y-1 mb-4 text-left">
                                    <h2 className="text-lg font-semibold text-gray-900">Informasi Tugas</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 text-left">Judul Tugas</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="border-gray-300 focus:border-blue-500 text-sm"
                                                            {...field}
                                                            placeholder="Masukkan judul tugas"
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-left" />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="startDate"
                                            render={({ field: { value, onChange, ...field } }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 text-left">Tanggal Mulai</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            className="border-gray-300 focus:border-blue-500 text-sm"
                                                            {...field}
                                                            value={value instanceof Date ? dayjs(value).format('YYYY-MM-DD') : ''}
                                                            onChange={(e) => {
                                                                onChange(new Date(e.target.value));
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-left" />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="dueDate"
                                            render={({ field: { value, onChange, ...field } }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 text-left">Tanggal Jatuh Tempo</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            className="border-gray-300 focus:border-blue-500 text-sm"
                                                            {...field}
                                                            value={value instanceof Date ? dayjs(value).format('YYYY-MM-DD') : ''}
                                                            onChange={(e) => {
                                                                onChange(new Date(e.target.value));
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-left" />
                                                </FormItem>
                                            )}
                                        />


                                        <div>
                                            <FormLabel className="text-gray-700 text-left">Kelas</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    setSelectedClassId(Number(value));
                                                    setSelectedSubjectId(null); // Reset subject when class changes
                                                    form.setValue("lessonId", 0); // Reset lesson selection
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih Kelas" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="max-h-40 overflow-y-auto">
                                                    {allClasses.map((classItem) => (
                                                        <SelectItem key={classItem.id} value={classItem.id.toString()}>
                                                            {classItem.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <FormLabel className="text-gray-700 text-left">Mata Pelajaran</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    setSelectedSubjectId(Number(value));
                                                    form.setValue("lessonId", 0); // Reset lesson selection
                                                }}
                                                disabled={!selectedClassId}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih Mata Pelajaran" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="max-h-40 overflow-y-auto">
                                                    {allSubjects.map((subject) => (
                                                        <SelectItem key={subject.id} value={subject.id.toString()}>
                                                            {subject.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="lessonId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 text-left">Pelajaran</FormLabel>
                                                    <Select
                                                        onValueChange={(value) => field.onChange(Number(value))}
                                                        disabled={!selectedClassId || !selectedSubjectId}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih Pelajaran" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="max-h-40 overflow-y-auto">
                                                            {filteredLessons.map((lesson) => (
                                                                <SelectItem key={lesson.id} value={lesson.id.toString()}>
                                                                    {lesson.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage className="text-left" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
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
        </AlertDialog >
    );
}
