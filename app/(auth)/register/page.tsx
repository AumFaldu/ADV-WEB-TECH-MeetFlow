"use client";

import { Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { registerUser } from "@/app/actions/registerUser";
import { useActionState } from "react";
export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, null);
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-8">
        
        {/* Header */}
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">
          Create account
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Sign up to get started with MeetFlow
        </p>
        {/* Form */}
        <form action={formAction} className="space-y-4">
          
          {/* Username */}
          <Input
            icon={<User size={18} />}
            name="name"
            placeholder="Username"
          />
          {state?.errors?.name && (
  <p className="text-red-500 text-sm">
    {state.errors.name[0]}
  </p>
)}

          {/* Role */}
          <select
  name="role"
  required
  className="w-full px-3 py-2.5 rounded-lg bg-white text-slate-900
            border border-slate-300
            focus:outline-none focus:ring-1 focus:ring-indigo-500"
>
  <option value="">Select role</option>
  <option value="STAFF">Staff</option>
  <option value="CONVENER">Meeting Organizer</option>
  <option value="ADMIN">Admin</option>
</select>
          {state?.errors?.role && (
  <p className="text-red-500 text-sm">
    {state.errors.role[0]}
  </p>
)}

          {/* Email */}
          <Input
            icon={<Mail size={18} />}
            name="email"
            type="email"
            placeholder="Email address"
          />
          {state?.errors?.email && (
  <p className="text-red-500 text-sm">
    {state.errors.email[0]}
  </p>
)}

          {/* Password */}
          <Input
            icon={<Lock size={18} />}
            name="password"
            type="password"
            placeholder="Password"
          />
          {state?.errors?.password && (
  <p className="text-red-500 text-sm">
    {state.errors.password[0]}
  </p>
)}

          {/* Confirm Password */}
          <Input
            icon={<Lock size={18} />}
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
          />
          {state?.errors?.confirmPassword && (
  <p className="text-red-500 text-sm">
    {state.errors.confirmPassword[0]}
  </p>
)}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium
                      hover:bg-indigo-700 transition"
          >
            Create account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

/* Reusable Input */
function Input({
  icon,
  ...props
}: {
  icon?: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}
      <input
        {...props}
        required
        className={`w-full px-3 py-2.5 rounded-lg bg-white text-slate-900
                    border border-slate-300
                    placeholder:text-slate-400
                    focus:outline-none focus:ring-1 focus:ring-indigo-500
                    ${icon ? "pl-10" : ""}`}
      />
    </div>
  );
}
