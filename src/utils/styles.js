export const inputClass = (fieldError) =>
  `w-full px-4 py-2 border ${
    fieldError ? "border-red-500" : "border-gray-300 dark:border-gray-700"
  } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 ${
    fieldError ? "focus:ring-red-500" : "focus:ring-orange-500"
  } focus:border-transparent outline-none transition`;

export const submitButtonClass =
  "w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105 hover:cursor-pointer active:scale-95 mt-6 disabled:opacity-50";
