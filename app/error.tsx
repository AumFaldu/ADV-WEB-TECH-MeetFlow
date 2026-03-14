"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
      <div className="w-full max-w-md text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
        
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-900">
          <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-400" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
          An unexpected error occurred while loading this page.
          You can try again, or go back to the home page.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition"
          >
            <RefreshCcw size={16} />
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Home size={16} />
            Go to home
          </Link>
        </div>

        {/* Dev-only error info */}
        {process.env.NODE_ENV === "development" && (
          <p className="mt-6 text-xs text-gray-400 dark:text-gray-500 break-all">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
