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
      name: "Profile",
      href: "/profile",
      icon: <User size={20} />,
      roles: ["ADMIN", "CONVENER", "STAFF"],
    },
    {
      name: "Master Configuration",
      href: "/master-configuration",
      icon: <Settings size={20} />,
      roles: ["ADMIN"], // Only admin
    },
    {
      name: "Reports",
      href: "/reports",
      icon: <BarChart2 size={20} />,
      roles: ["ADMIN", "CONVENER"], // Staff can't see
    },
  ];

  // 🔐 Filter links based on role
  const links = allLinks.filter((link) =>
    link.roles.includes(role)
  );

  return (
    <aside
      className={clsx(
        "flex flex-col transition-all duration-300 overflow-hidden",
        collapsed ? "w-16 p-2" : "w-64 p-6",
        darkMode ? "bg-gray-900 text-white" : "bg-indigo-700 text-white"
      )}
    >
      {!collapsed && (
        <h2 className="text-xl font-bold mb-6">MeetFlow</h2>
      )}

      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex items-center gap-2 rounded-lg transition-colors duration-300",
              collapsed ? "justify-center px-0 py-2" : "px-3 py-2",
              pathname.startsWith(link.href)
                ? darkMode
                  ? "bg-gray-700 font-semibold"
                  : "bg-indigo-900 font-semibold"
                : darkMode
                ? "hover:bg-gray-700"
                : "hover:bg-indigo-600"
            )}
          >
            {link.icon}
            {!collapsed && <span>{link.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}