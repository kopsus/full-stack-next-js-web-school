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
import { createClass } from "@/lib/actions/class";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Teacher, Grade } from "@prisma/client";
import CustomSearchableInputTeacher from "@/components/CustomSearchableInputTeacher";
import { useState } from "react";
import { classSchema } from "@/lib/formValidationSchemas/class";
import type { ClassSchema } from "@/lib/formValidationSchemas/class";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ButtonCreateClass({ teachers, grades }: { teachers: Teacher[], grades: Grade[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  const form = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: "",
      capacity: 0,
      gradeId: 0,
      supervisorId: undefined,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: ClassSchema) {
    const result = await createClass(values);
    if (result.success) {
      toast.success(result.success.message);
      setOpen(false);
      router.push("/list/classes");
    } else if (result.error) {
      toast.error(result.error.message);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kelas
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tambah Kelas</AlertDialogTitle>
          <AlertDialogDescription className="hidden">
            Isi formulir berikut untuk menambahkan kelas baru. Pastikan semua data yang dimasukkan sudah benar.
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-left">Nama Kelas</FormLabel>
                        <FormControl>
                          <Input
                            className="border-gray-300 focus:border-blue-500"
                            {...field}
                            placeholder="Masukkan nama kelas"
                          />
                        </FormControl>
                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-left">Kapasitas</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="border-gray-300 focus:border-blue-500"
                            {...field}
                            placeholder="Masukkan kapasitas kelas"
                          />
                        </FormControl>
                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gradeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-left">Tingkat</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Tingkat" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {grades.sort((a, b) => a.level - b.level).map((grade) => (
                              <SelectItem key={grade.id} value={grade.id.toString()}>
                                {grade.level}
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
                    name="supervisorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-left">Wali Kelas</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Wali Kelas" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teachers.map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                {teacher.first_name} {teacher.last_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-left" />
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