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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { studentSchema } from "@/lib/formValidationSchemas/student";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { updateStudent } from "@/lib/actions/student";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import ButtonBack from "../../ButtonBack";
import FieldPasswordCustom from "../../ui/field-password-custom";

export default function StudentFormUpdate({
  classes,
  parents,
  grades,
  defaultValues,
}: {
  classes: any[];
  parents: any[];
  grades: any[];
  defaultValues: any;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultValues.img || null
  );
  const [imageProfile, setImageProfile] = useState<File | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number>(
    defaultValues.gradeId
  );
  const router = useRouter();

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      id: defaultValues.id,
      first_name: defaultValues.first_name,
      last_name: defaultValues.last_name,
      email: defaultValues.email,
      phone: defaultValues.phone,
      address: defaultValues.address,
      username: defaultValues.username,
      password: "",
      blood_type: defaultValues.blood_type,
      sex: defaultValues.sex,
      role: "STUDENT",
      parentId: defaultValues.parentId,
      classId: defaultValues.classId,
      gradeId: defaultValues.gradeId,
      img: defaultValues.img || "",
      birthday: new Date(defaultValues.birthday),
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const filteredClasses = classes.filter(
    (classItem) => classItem.gradeId === selectedGrade
  );

  async function onSubmit(values: z.infer<typeof studentSchema>) {
    const formData = new FormData();
    if (imageProfile) {
      formData.append("img", imageProfile as File);
    }

    const data = {
      ...values,
      password:
        values.password === "" ? defaultValues.password : values.password,
    };

    const result = await updateStudent(defaultValues.id, data, formData);
    if (result.success?.status) {
      toast.success(result.success.message);
      router.push("/list/students");
    } else if (result.error?.status) {
      toast.error(result.error.message);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex-1 m-4 mt-0 md:w-10/12">
      <div className="flex flex-row justify-between items-center mb-6">
        <ButtonBack />
        <h1 className="font-bold text-gray-900">Ubah Siswa</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm hover:border-blue-400 transition-all duration-300 md:order-2">
                {(previewUrl || defaultValues.img) && (
                  <Image
                    src={
                      defaultValues.img
                        ? `/uploads/${defaultValues.img}`
                        : previewUrl || defaultValues.img
                    }
                    alt="Preview"
                    className="w-full h-full object-cover"
                    width={160}
                    height={160}
                  />
                )}
              </div>
              <div className="w-full lg:w-4/12 md:w-6/12 md:order-1">
                <FormField
                  control={form.control}
                  name="img"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Foto
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*"
                            className="h-12 border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 rounded-lg cursor-pointer file:cursor-pointer pl-12 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              setImageProfile(file || null);
                              if (file) {
                                const url = URL.createObjectURL(file);
                                setPreviewUrl(url);
                              }
                            }}
                          />
                          <Upload className="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Autentikasi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Username</FormLabel>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="border-gray-300 focus:border-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FieldPasswordCustom form={form} />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">Profil</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Nama Depan
                      </FormLabel>
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
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Nama Belakang
                      </FormLabel>
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Nomor Telepon
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
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
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Tanggal Lahir
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="border-gray-300 focus:border-blue-500"
                          value={dayjs(field.value).format("YYYY-MM-DD")}
                          onChange={(e) =>
                            field.onChange(new Date(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="blood_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Golongan Darah
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Pilih golongan darah" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="AB">AB</SelectItem>
                          <SelectItem value="O">O</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Jenis Kelamin
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Pilih jenis kelamin" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          <SelectItem value="MALE">Laki-laki</SelectItem>
                          <SelectItem value="FEMALE">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gradeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Kelas</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedGrade(Number(value));
                          // Reset classId when grade changes
                          form.setValue("classId", 1);
                        }}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Pilih kelas" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {grades.map((grade) => (
                            <SelectItem
                              key={grade.id}
                              value={grade.id.toString()}
                            >
                              Kelas {grade.level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Ruang Kelas
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Pilih ruang kelas" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {filteredClasses.map((classItem) => (
                            <SelectItem
                              key={classItem.id}
                              value={classItem.id.toString()}
                            >
                              {classItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Orang Tua</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Pilih orang tua" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {parents.map((parent) => (
                            <SelectItem
                              key={parent.id}
                              value={parent.id.toString()}
                            >
                              {parent.first_name} {parent.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormLabel className="text-gray-700">Alamat</FormLabel>
                      <FormControl>
                        <Textarea
                          className="border-gray-300 focus:border-blue-500 min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
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
  );
}
