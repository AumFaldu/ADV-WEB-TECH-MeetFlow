"use client";

import { useState } from "react";
import { Menu, User, ChevronDown, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { logout } from "../actions/logout";
import { useDarkMode } from "../layout";
interface HeaderProps {
  toggleSidebar?: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between px-6 h-16 backdrop-blur-xl border-b transition-all
        ${darkMode ? "bg-gray-900/70 border-gray-700 text-white" : "bg-white/70 border-gray-200 text-gray-900"}`}
    >
      <div className="flex items-center gap-3">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition"
          >
            <Menu size={22} />
          </button>
        )}
        <h1 className="text-lg font-semibold tracking-tight">MeetFlow</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border hover:shadow-md transition dark:border-gray-600"
          >
            <User size={18} />
            <ChevronDown size={14} />
          </button>

          {open && (
            <div
              className={`absolute right-0 z-50 mt-3 w-44 rounded-xl shadow-xl border overflow-hidden
                ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10 transition"
              >
                Profile
              </Link>
              <button
                onClick={async () => await logout()}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-500/10 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}