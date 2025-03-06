import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";

export default function FieldPasswordCustom({
  form,
}: {
  form: UseFormReturn<any>;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700">Password</FormLabel>
          <FormControl className="relative">
            <div className="relative w-full">
              <Input
                type={showPassword ? "text" : "password"}
                className="border-gray-300 focus:border-blue-500 w-full"
                {...field}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute bg-white/80 inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
