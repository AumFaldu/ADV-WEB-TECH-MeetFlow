"use client";

import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb] px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center">
        
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
          <AlertCircle size={32} className="text-indigo-600" />
        </div>

        {/* Text */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          404 — Page Not Found
        </h1>

        <p className="text-gray-500 mb-6">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        {/* Action */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition"
        >
          <Home size={16} />
          Go Home
        </Link>
      </div>
    </div>
  );
}
