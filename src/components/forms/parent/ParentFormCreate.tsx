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
import { parentSchema } from "@/lib/formValidationSchemas/parent";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { createParent } from "@/lib/actions/parent";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import ButtonBack from "../../ButtonBack";
import FieldPasswordCustom from "../../ui/field-password-custom";
import { Student } from "@prisma/client";
import CustomSearchableInputStudent from "@/components/CustomSearchableInputStudent";

export default function ParentFormCreate({
  students,
}: {
  students: Student[];
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageProfile, setImageProfile] = useState<File | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof parentSchema>>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      username: "",
      password: "",
      blood_type: "A",
      sex: "MALE",
      img: "",
      birthday: new Date(),
      students: [],
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof parentSchema>) {
    const formData = new FormData();
    if (imageProfile) {
      formData.append("img", imageProfile as File);
    }

    const result = await createParent(values, formData);
    if (result.success?.status) {
      toast.success(result.success.message);
      router.push("/list/parents");
    } else if (result.error?.status) {
      toast.error(result.error.message);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex-1 m-4 mt-0">
      <div className="flex flex-row justify-between items-center mb-6">
        <ButtonBack />
        <h1 className="font-bold text-gray-900">Tambah Orang Tua</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {previewUrl && (
                <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm hover:border-blue-400 transition-all duration-300 md:order-2">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    width={160}
                    height={160}
                  />
                </div>
              )}
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
                            required
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
                          placeholder="masukan Username"
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
                          placeholder="example@gmail.com"
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
                          placeholder="masukan Nama Depan"
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
                          placeholder="masukan Nama Belakang"
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
                          placeholder="masukan Nomor Telepon"
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
                          placeholder="masukan alamat"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Data Siswa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomSearchableInputStudent form={form} students={students} />
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
