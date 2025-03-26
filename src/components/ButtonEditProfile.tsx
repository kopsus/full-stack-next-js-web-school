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
import { Pencil, Upload } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import dayjs from "dayjs";
import {
  ProfileSchema,
  profileSchema,
} from "@/lib/formValidationSchemas/profile";
import { updateProfile } from "@/lib/actions/edit-profile";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface IButtonEdit {
  setProfile: any;
  data: ProfileSchema;
}

export default function ButtonEdit({ data, setProfile }: IButtonEdit) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    data.img ? `/uploads/${data.img}` : null
  );
  const [imageProfile, setImageProfile] = useState<File | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...data,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      phone: data.phone || null,
      address: data.address || null,
      blood_type: data.blood_type || null,
      birthday: new Date(data.birthday),
      sex: data.sex || "MALE", // Default value for required field
      img: data.img || null,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageProfile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        form.setValue("img", file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  async function waitForImageAvailability(
    imageUrl: string,
    maxRetries = 10,
    delay = 500
  ) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(imageUrl, { method: "HEAD" });
        if (response.ok) return true;
      } catch (error) {
        console.log("Menunggu gambar tersedia...", error);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    return false;
  }

  async function onSubmit(values: ProfileSchema) {
    try {
      setIsUploading(true);

      const formData = new FormData();
      if (imageProfile) {
        formData.append("img", imageProfile as File);
      }

      const submitValues = {
        username: values.username,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        blood_type: values.blood_type,
        sex: values.sex,
        birthday: values.birthday,
        role: values.role,
        img: imageProfile ? imageProfile.name : values.img,
        ...(newPassword ? { password: newPassword } : {}),
      };

      const result = await updateProfile(
        data.id!,
        data.role!,
        submitValues,
        formData
      );

      if (result.success?.status) {
        toast.success(result.success.message);

        // Tunggu hingga gambar tersedia di server
        const imageUrl = `/uploads/${imageProfile?.name}`;
        const isImageAvailable = await waitForImageAvailability(imageUrl);

        if (isImageAvailable) {
          setProfile((prev: { img: any }) => ({
            ...prev,
            img: `${imageProfile?.name}?t=${new Date().getTime()}`,
          }));
        } else {
          toast.error("Gambar belum tersedia, coba refresh halaman.");
        }

        setOpen(false);
      } else {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="mr-2 h-4 w-4" />
          Edit Profil
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Profile</AlertDialogTitle>
          <AlertDialogDescription className="hidden">
            Update your profile information below.
          </AlertDialogDescription>
          <div className="overflow-y-auto max-h-[510px]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="flex justify-center mb-2 md:mb-6">
                  <div className="relative">
                    <Image
                      src={previewUrl ? previewUrl : "/avatar.png"}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="rounded-full object-cover border-2 border-gray-300 h-[100px] w-[100px]"
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-left">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Username
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

                  <div className="grid grid-cols-1 gap-2">
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
                              value={field.value || ""}
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
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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

                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Password Baru
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="border-gray-300 focus:border-blue-500"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Kosongkan jika tidak ingin mengubah password"
                      />
                    </FormControl>
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          No. Telepon
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="border-gray-300 focus:border-blue-500"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Alamat</FormLabel>
                        <FormControl>
                          <Textarea
                            className="border-gray-300 focus:border-blue-500"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="blood_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Jenis Darah
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Jenis Darah" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="AB">AB</SelectItem>
                              <SelectItem value="O">O</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
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
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Jenis Kelamin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MALE">Laki-laki</SelectItem>
                              <SelectItem value="FEMALE">Perempuan</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                            {...field}
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
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? "Menyimpan..." : "Simpan"}
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
