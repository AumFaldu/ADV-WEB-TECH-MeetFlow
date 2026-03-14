"use client";

import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center
    bg-gray-50 dark:bg-gray-900 px-6">

      <div className="w-full max-w-xl text-center">

        {/* Loader Circle */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center
        rounded-3xl bg-white dark:bg-gray-800
        shadow-lg border border-gray-200 dark:border-gray-700">

          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Loading workspace
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Please wait while we prepare your dashboard.
        </p>

      </div>

    </div>
  );
}