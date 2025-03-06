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
import { createExam } from "@/lib/actions/exam";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useState } from "react";
import { examSchema } from "@/lib/formValidationSchemas/exam";
import type { ExamSchema } from "@/lib/formValidationSchemas/exam";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";
import { Lesson, Subject, Teacher, Class } from "@prisma/client";

type LessonWithDetails = Lesson & {
  class: Class;
  teacher: Teacher;
  subject: Subject;
}

interface ButtonCreateExamProps {
  allSubjects: Subject[];
  allLessons: LessonWithDetails[];
}

export default function ButtonCreateExam({ allSubjects, allLessons }: ButtonCreateExamProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  
  const form = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: "",
      startTime: new Date(),
      endTime: new Date(),
      lessonId: 1,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  // Filter classes based on selected subject
  const availableClasses = selectedSubject 
    ? allLessons.filter(lesson => lesson.subject.id === selectedSubject)
    : [];

  async function onSubmit(values: ExamSchema) {
    const result = await createExam(values);
    if (result.success) {
      toast.success(result.success.message);
      setOpen(false);
      router.push("/list/exams");
    } else if (result.error) {
      toast.error(result.error.message);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Ujian
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Tambah Ujian</AlertDialogTitle>
          <AlertDialogDescription className="hidden">
            Isi formulir berikut untuk menambahkan ujian baru. Pastikan semua data yang dimasukkan sudah benar.
          </AlertDialogDescription>
          <div className="mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2 text-left"
              >
                <div className="mb-1 text-left">
                  <h2 className="text-lg font-semibold text-gray-900">Informasi Ujian</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-left">Judul Ujian</FormLabel>
                          <FormControl>
                            <Input
                              className="border-gray-300 focus:border-blue-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-left" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-2">
                      <FormItem>
                        <FormLabel className="text-gray-700 text-left">Mata Pelajaran</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            setSelectedSubject(Number(value));
                            form.setValue("lessonId", 0); // Reset lesson selection
                          }}
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
                      </FormItem>

                      <FormField
                        control={form.control}
                        name="lessonId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 text-left">Kelas</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange(Number(value))}
                              disabled={!selectedSubject}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-40 overflow-y-auto">
                                {availableClasses.map((lesson) => (
                                  <SelectItem key={lesson.id} value={lesson.id.toString()}>
                                    {lesson.class.name}
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
                </div>

                <div className="space-y-1 mb-4 text-left">
                  <h2 className="text-lg font-semibold text-gray-900">Waktu Ujian</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-left">Waktu Mulai</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              className="border-gray-300 focus:border-blue-500 text-sm"
                              {...field}
                              value={value instanceof Date ? dayjs(value).format('YYYY-MM-DDTHH:mm') : ''}
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
                      name="endTime"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-left">Waktu Selesai</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              className="border-gray-300 focus:border-blue-500 text-sm"
                              {...field}
                              value={value instanceof Date ? dayjs(value).format('YYYY-MM-DDTHH:mm') : ''}
                              onChange={(e) => {
                                onChange(new Date(e.target.value));
                              }}
                            />
                          </FormControl>
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
    </AlertDialog>
  );
}