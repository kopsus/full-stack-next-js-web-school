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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { teacherSchema } from "@/lib/formValidationSchemas/teacher";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { updateTeacher } from "@/lib/actions/teacher";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import ButtonBack from "../../ButtonBack";
import FieldPasswordCustom from "../../ui/field-password-custom";

export default function TeacherFormUpdate({
  subjects,
  defaultValues,
}: {
  subjects: any[];
  defaultValues: any;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultValues.img || null
  );
  const [imageProfile, setImageProfile] = useState<File | null>(null);
  const router = useRouter();

  // Get subject IDs from defaultValues.subjects
  const defaultSubjectIds = defaultValues.subjects.map(
    (subject: any) => subject.id
  );

  // 1. Define your form.
  const form = useForm<z.infer<typeof teacherSchema>>({
    resolver: zodResolver(teacherSchema),
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
      subjects: defaultSubjectIds,
      classes: defaultValues.classes || [],
      birthday: new Date(defaultValues.birthday),
      img: defaultValues.img || "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof teacherSchema>) {
    const formData = new FormData();
    if (imageProfile) {
      formData.append("img", imageProfile as File);
    }

    const data = {
      ...values,
      password:
        values.password === "" ? defaultValues.password : values.password,
    };

    const result = await updateTeacher(defaultValues.id, data, formData);

    if (result.success?.status) {
      toast.success(result.success.message);
      router.push("/list/teachers");
    } else if (result.error?.status) {
      toast.error(result.error.message);
    }
  }

  console.log("data teacher", defaultValues);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex-1 m-4 mt-0 md:w-10/12">
      <div className="flex flex-row justify-between items-center mb-6">
        <ButtonBack />
        <h1 className="font-bold text-gray-900">Ubah Guru</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 shadow-sm hover:border-blue-400 transition-all duration-300 md:order-2">
                <Image
                  src={
                    previewUrl
                      ? previewUrl
                      : defaultValues.img
                      ? `/uploads/${defaultValues.img}`
                      : "/avatar.png"
                  }
                  alt="Preview"
                  className="w-full h-full object-cover"
                  width={160}
                  height={160}
                />
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
                <FormField
                  control={form.control}
                  name="subjects"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormLabel className="text-gray-700">
                        Mata Pelajaran
                      </FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border rounded-lg border-gray-300">
                        {subjects.map((subject) => (
                          <div
                            key={subject.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              checked={field.value.includes(subject.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, subject.id]);
                                } else {
                                  field.onChange(
                                    field.value.filter(
                                      (id) => id !== subject.id
                                    )
                                  );
                                }
                              }}
                            />
                            <label className="text-sm text-gray-700">
                              {subject.name}
                            </label>
                          </div>
                        ))}
                      </div>
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
