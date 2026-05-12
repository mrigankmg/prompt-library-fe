import { inputClass } from "../utils/styles";

export default function FormField({
  label,
  type = "text",
  registration,
  error,
  placeholder,
  as: As = "input",
  className = "",
  ...rest
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
        {label}
      </label>
      <As
        {...(As === "input" && { type })}
        {...registration}
        placeholder={placeholder}
        className={[inputClass(error), className].filter(Boolean).join(" ")}
        {...rest}
      />
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
}
