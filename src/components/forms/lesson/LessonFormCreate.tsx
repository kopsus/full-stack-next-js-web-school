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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { createLesson } from "@/lib/actions/lesson";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Teacher, Class, Subject } from "@prisma/client";
import { useState } from "react";
import { lessonSchema } from "@/lib/formValidationSchemas/lesson";
import type { LessonSchema } from "@/lib/formValidationSchemas/lesson";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";

export default function ButtonCreateLesson({
  teachers,
  classes,
  subjects,
}: {
  teachers: Teacher[];
  classes: Class[];
  subjects: Subject[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: "",
      day: "FRIDAY",
      startTime: new Date(),
      endTime: new Date(),
      subjectId: 1,
      teacherId: "1",
      classId: 1,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: LessonSchema) {
    const result = await createLesson(values);
    if (result.success) {
      toast.success(result.success.message);
      setOpen(false);
      router.push("/list/lessons");
    } else if (result.error) {
      toast.error(result.error.message);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pelajaran
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Tambah Pelajaran</AlertDialogTitle>
          <AlertDialogDescription className="hidden">
            Isi formulir berikut untuk menambahkan pelajaran baru. Pastikan
            semua data yang dimasukkan sudah benar.
          </AlertDialogDescription>
          <div className="mt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2 text-left"
              >
                <div className="mb-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Informasi Pelajaran
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-left">
                            Nama Pelajaran
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="border-gray-300 focus:border-blue-500"
                              {...field}
                              placeholder="Masukkan nama pelajaran"
                            />
                          </FormControl>
                          <FormMessage className="text-left" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subjectId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-left">
                            Mata Pelajaran
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Mata Pelajaran" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-40 overflow-y-auto">
                              {/* TODO: Add subjects data */}
                              {subjects.map((item) => (
                                <SelectItem
                                  key={item.id}
                                  value={item.id.toString()}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-left" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="teacherId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-left">
                            Guru
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Guru" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-40 overflow-y-auto">
                              {teachers.map((teacher) => (
                                <SelectItem
                                  key={teacher.id}
                                  value={teacher.id.toString()}
                                >
                                  {teacher.first_name} {teacher.last_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-left" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="classId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-left">
                            Kelas
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Kelas" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-56 overflow-y-auto">
                              {classes.map((class_) => (
                                <SelectItem
                                  key={class_.id}
                                  value={class_.id.toString()}
                                >
                                  {class_.name}
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

                <div className="">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Jadwal
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name="day"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-left">
                            Hari
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Hari" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MONDAY">Senin</SelectItem>
                              <SelectItem value="TUESDAY">Selasa</SelectItem>
                              <SelectItem value="WEDNESDAY">Rabu</SelectItem>
                              <SelectItem value="THURSDAY">Kamis</SelectItem>
                              <SelectItem value="FRIDAY">Jumat</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-left" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 text-left">
                            Waktu Mulai
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              className="border-gray-300 focus:border-blue-500"
                              {...field}
                              value={
                                value instanceof Date
                                  ? dayjs(value).format("HH:mm")
                                  : ""
                              }
                              onChange={(e) => {
                                const [hours, minutes] =
                                  e.target.value.split(":");
                                const newDate = new Date();
                                newDate.setHours(
                                  parseInt(hours),
                                  parseInt(minutes)
                                );
                                onChange(newDate);
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
                          <FormLabel className="text-gray-700 text-left">
                            Waktu Selesai
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              className="border-gray-300 focus:border-blue-500"
                              {...field}
                              value={
                                value instanceof Date
                                  ? dayjs(value).format("HH:mm")
                                  : ""
                              }
                              onChange={(e) => {
                                const [hours, minutes] =
                                  e.target.value.split(":");
                                const newDate = new Date();
                                newDate.setHours(
                                  parseInt(hours),
                                  parseInt(minutes)
                                );
                                onChange(newDate);
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
