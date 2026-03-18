"use client";

import { FC } from "react";
import { FaEnvelope, FaUser, FaPhone, FaUserShield } from "react-icons/fa";
import Link from "next/link";

interface UserProfileCardProps {
  user: any;
}

const UserProfileCard: FC<UserProfileCardProps> = ({ user }) => {
  return (
    <div className="w-full max-w-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-5 mb-6">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-2xl font-semibold text-gray-700 dark:text-gray-200">
          {user.UserName?.charAt(0) || "U"}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {user.UserName || "User Name"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {user.Role}
          </p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          <FaEnvelope className="text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {user.Email}
            </p>
          </div>
        </div>

        {user?.Role !== "ADMIN" && (
          <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <FaPhone className="text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Mobile</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {user?.staff?.MobileNo || "N/A"}
              </p>
            </div>
          </div>
        )}

        {(user.role==="STAFF" || user.role==="CONVENER") && (
          <>
            <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <FaUser className="text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Staff ID</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user.StaffID}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <FaUser className="text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user?.staff?.department?.DepartmentName || "Not Assigned"}
                </p>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          <FaUserShield className="text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {user.Role}
            </p>
          </div>
        </div>

      </div>

      {/* Dates */}
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>
          Account Created: {new Date(user.Created).toLocaleDateString()}
        </p>
        <p>
          Last Modified:{" "}
          {new Date(user.Modified).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      {/* Button */}
      <div className="mt-6 flex justify-end">
        <Link
          href="/profile/edit"
          className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default UserProfileCard;
