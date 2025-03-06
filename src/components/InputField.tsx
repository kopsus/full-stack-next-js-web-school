import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  placeholder?: string;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  hidden,
  inputProps,
  placeholder,
}: InputFieldProps) => {
  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            {...register(name)}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full min-h-[80px]"
            defaultValue={defaultValue}
            {...inputProps}
            placeholder={placeholder}
          />
        );
      case "date":
        return (
          <input
            type="date"
            {...register(name)}
            className="ring-[1.5px] ring-gray-300 px-2 py-1 h-9 rounded-md text-sm w-full"
            defaultValue={defaultValue}
            {...inputProps}
          />
        );
      case "password":
        return (
          <input
            type="password"
            {...register(name)}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={defaultValue}
            {...inputProps}
            placeholder={placeholder}
          />
        );
      default:
        return (
          <input
            type={type}
            {...register(name)}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={defaultValue}
            {...inputProps}
            placeholder={placeholder}
          />
        );
    }
  };


  return (
    <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full"}>
      <label className="text-xs text-gray-500">{label}</label>
      {renderInput()}
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
