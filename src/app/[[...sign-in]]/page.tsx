"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { z } from "zod";
import InputPassword from "@/components/InputPassword";
import {
  formLoginSchema,
  FormLoginSchema,
} from "@/lib/formValidationSchemas/login";
import { login } from "@/lib/actions/login";
import { responServerAction } from "@/lib/actions/responServerActionType";
import { toast } from "react-toastify";

const LoginPage = () => {
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<FormLoginSchema>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formLoginSchema>) {
    const result: responServerAction = await login(values);
    if (result.success?.status) {
      toast.success(result.success.message);
      // redirect to dashboard
      router.push("/");
    }

    if (result.error?.status) {
      toast.error(result.error.message);
    }
  }

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-lamaSkyLight px-3">
      <div className="flex justify-center mb-4">
        <Image src="/logo.png" alt="logo" width={112} height={112} />
      </div>
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md md:w-[350px]">
        <h1 className="text-2xl font-bold text-center mb-4">
          Sistem Informasi Akademik
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="masukkan username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl className="mb-2">
                    <InputPassword placeholder="masukkan password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full mt-3 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
      <div className="absolute bottom-0 right-0 space-y-2 bg-white p-5 shadow-md rounded-xl">
        <p>username : admin</p>
        <p>password : admin123</p>
      </div>
    </div>
  );
};

export default LoginPage;
