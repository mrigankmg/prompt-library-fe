import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-16 px-4">
      <p className="text-8xl md:text-9xl font-extrabold text-orange-600 dark:text-orange-400 mb-4 leading-none">
        404
      </p>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        Page not found
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/home"
        className="inline-block bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg font-medium transition hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
