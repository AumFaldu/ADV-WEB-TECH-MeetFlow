"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb] dark:bg-gray-900 px-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 text-center">
        
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900">
          <Lock size={32} className="text-red-600 dark:text-red-400" />
        </div>

        {/* Text */}
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          403 — Unauthorized
        </h1>

        <p className="text-gray-500 dark:text-gray-300 mb-6">
          Oops! You don’t have permission to access this page.
        </p>

        {/* Action */}
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 dark:bg-red-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 dark:hover:bg-red-600 transition"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}
