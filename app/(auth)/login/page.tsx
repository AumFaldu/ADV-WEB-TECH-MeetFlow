"use client";

import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { checkLogin } from "@/app/actions/checkLogin";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(
  (prevState: { errors?: Record<string, string[]>; message?: string } | null, formData: FormData) =>
    checkLogin(prevState, formData),
  null
);


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Sign in</h1>
        <p className="text-sm text-slate-600 mb-6">Use your MeetFlow account</p>

        <form action={formAction} className="space-y-4">
          {state?.message && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 p-2 rounded">
              {state.message}
            </p>
          )}

          {/* Email */}
          <Input
            icon={<Mail size={18} />}
            name="email"
            type="email"
            placeholder="Email address"
            required
          />
          {state?.errors?.email && (
            <p className="text-red-500 text-sm">{state.errors.email[0]}</p>
          )}

          {/* Password */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock size={18} />
            </div>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              className="w-full px-3 py-2.5 pl-10 pr-10 rounded-lg
                         bg-white text-slate-900
                         border border-slate-300
                         placeholder:text-slate-400
                         focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {state?.errors?.password && (
              <p className="text-red-500 text-sm">{state.errors.password[0]}</p>
            )}

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium
                       hover:bg-indigo-700 transition"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link href="/register" className="text-indigo-600 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

function Input({ icon, ...props }: { icon?: React.ReactNode; [key: string]: any }) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full px-3 py-2.5 rounded-lg bg-white text-slate-900
                    border border-slate-300
                    placeholder:text-slate-400
                    focus:outline-none focus:ring-1 focus:ring-indigo-500
                    ${icon ? "pl-10" : ""}`}
      />
    </div>
  );
}
