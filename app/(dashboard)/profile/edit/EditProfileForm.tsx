"use client";

import { useActionState } from "react";
import { updateProfile } from "./action";

interface Props {
  user: any;
}

interface State {
  errors?: {
    name?: string[];
    email?: string[];
    mobile?: string[];
  };
  message?: string;
}

const initialState: State = {
  errors: {},
};

export default function EditProfileForm({ user }: Props) {

  const updateProfileWrapper = (prevState: State, formData: FormData) => {
    return updateProfile(prevState, formData);
  };

  const [state, formAction, isPending] = useActionState(
    updateProfileWrapper,
    initialState
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
      <form
        action={formAction}
        className="w-full max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">
          Edit Profile
        </h1>

        {/* Name */}
        <div>
          <input
            name="name"
            defaultValue={user?.UserName ?? ""}
            placeholder="UserName"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {state?.errors?.name && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.name[0]}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            name="email"
            defaultValue={user?.Email ?? ""}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {state?.errors?.email && (
            <p className="text-red-500 text-sm mt-1">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        {/* Mobile */}
        {user?.Role !== "ADMIN" && (
          <div>
            <input
              name="mobile"
              defaultValue={user?.staff?.MobileNo ?? ""}
              placeholder="Mobile Number"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {state?.errors?.mobile && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.mobile[0]}
              </p>
            )}
          </div>
        )}

        {/* Message */}
        {state?.message && (
          <p className="text-green-600 dark:text-green-400 text-sm text-center">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 rounded-xl text-white font-semibold
                     bg-indigo-600 hover:bg-indigo-700
                     transition disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}