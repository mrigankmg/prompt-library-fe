export const inputClass = (fieldError) =>
  `w-full px-4 py-2 border ${
    fieldError ? "border-red-500" : "border-gray-300 dark:border-gray-700"
  } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 ${
    fieldError ? "focus:ring-red-500" : "focus:ring-orange-500"
  } focus:border-transparent outline-none transition`;
