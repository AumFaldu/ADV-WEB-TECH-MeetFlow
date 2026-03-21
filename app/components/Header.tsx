"use client";

import { useState } from "react";
import { Menu, Sun, Moon, LogOut, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import { logout } from "../actions/logout";
import { useDarkMode } from "../layout";
import { usePathname } from "next/navigation";

interface HeaderProps {
  toggleSidebar?: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();

  const pathname = usePathname();
  const rawSegments = pathname.split("/").filter(Boolean);
  const segments = rawSegments.filter(
    (seg) => isNaN(Number(seg))
  );
  const pageTitle =
    segments.length > 0
      ? segments[segments.length - 1]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "Dashboard";

  let path = "";

  return (
    <header
      className={`sticky top-0 z-40 h-16 flex items-center justify-between px-8 border-b backdrop-blur transition
      ${
        darkMode
          ? "bg-slate-900/70 border-slate-800 text-slate-100"
          : "bg-white/70 border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="flex flex-col">
          {/* ⭐ Dynamic Title */}
          <h1 className="text-lg font-semibold tracking-tight">
            {pageTitle}
          </h1>
          <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Link
              href="/dashboard"
              className="hover:text-indigo-500 transition"
            >
              Dashboard
            </Link>

            {segments.slice(1).map((segment, index) => {
              path += `/${segment}`;
              const isLast =
                index === segments.slice(1).length - 1;

              const label = segment
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());

              return (
                <span
                  key={path}
                  className="flex items-center gap-1"
                >
                  <span>/</span>

                  {isLast ? (
                    <span className="text-slate-700 dark:text-slate-200">
                      {label}
                    </span>
                  ) : (
                    <Link
                      href={path}
                      className="hover:text-indigo-500 transition"
                    >
                      {label}
                    </Link>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
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
              className={`absolute right-0 mt-3 w-48 rounded-xl border shadow-xl overflow-hidden
              ${
                darkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <User size={16} />
                Profile
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
