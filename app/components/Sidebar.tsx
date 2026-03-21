"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Home,
  User,
  Settings,
  Calendar,
  BarChart2,
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  darkMode: boolean;
  role: "ADMIN" | "CONVENER" | "STAFF";
}

export default function Sidebar({
  collapsed,
  darkMode,
  role,
}: SidebarProps) {
  const pathname = usePathname();

  const allLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Home size={20} />,
      roles: ["ADMIN", "CONVENER", "STAFF"],
    },
    {
      name: "Meetings",
      href: "/meetings",
      icon: <Calendar size={20} />,
      roles: ["ADMIN", "CONVENER", "STAFF"],
    },
    {
      name: "Reports",
      href: "/reports",
      icon: <BarChart2 size={20} />,
      roles: ["ADMIN", "CONVENER"],
    },
    {
      name: "Master",
      href: "/master-configuration",
      icon: <Settings size={20} />,
      roles: ["ADMIN"],
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <User size={20} />,
      roles: ["ADMIN", "CONVENER", "STAFF"],
    },
  ];

  const links = allLinks.filter((l) => l.roles.includes(role));

  return (
    <aside
      className={clsx(
        "h-screen sticky top-0 transition-all duration-300 border-r",
        collapsed ? "w-16 px-2 py-4" : "w-64 px-4 py-6",
        darkMode
          ? "bg-slate-900 border-slate-800 text-slate-200"
          : "bg-white border-slate-200 text-slate-700"
      )}
    >
      {!collapsed && (
        <h2 className="text-xl font-semibold mb-8 tracking-tight">
          MeetFlow
        </h2>
      )}

      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);

          return (
            <Link
              key={link.name}
              href={link.href}
              title={collapsed ? link.name : ""}
              className={clsx(
                "relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                collapsed && "justify-center",
                active
                  ? darkMode
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-900"
                  : darkMode
                  ? "hover:bg-slate-800 hover:text-white"
                  : "hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-indigo-500" />
              )}

              {link.icon}

              {!collapsed && <span>{link.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
