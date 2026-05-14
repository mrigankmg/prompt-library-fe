import { useId } from "react";
import { inputClass } from "../utils/styles";

export default function FormField({
  label,
  type = "text",
  registration,
  error,
  placeholder,
  as: As = "input",
  className = "",
  id,
  ...rest
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"
      >
        {label}
      </label>
      <As
        id={fieldId}
        {...(As === "input" && { type })}
        {...registration}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={[inputClass(error), className].filter(Boolean).join(" ")}
        {...rest}
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-red-600 dark:text-red-400 text-sm mt-1"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}
