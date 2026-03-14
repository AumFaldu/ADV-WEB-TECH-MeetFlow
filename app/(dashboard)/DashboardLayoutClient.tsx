"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useDarkMode } from "../layout";

interface Props {
  children: React.ReactNode;
  role: "ADMIN" | "CONVENER" | "STAFF";
}

export default function DashboardLayoutClient({
  children,
  role,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const { darkMode } = useDarkMode();

  return (
  <div
    className={`flex min-h-screen transition-colors
      ${darkMode
        ? "bg-gray-950 text-gray-100"
        : "bg-gray-50 text-gray-900"
      }`}
  >
    <Sidebar
      collapsed={collapsed}
      darkMode={darkMode}
      role={role}
    />

    <div className="flex flex-col flex-1">
      <Header toggleSidebar={() => setCollapsed(!collapsed)} />

      <main className="flex-1 p-6 transition-colors">
        {children}
      </main>

      <Footer darkMode={darkMode} />
    </div>
  </div>
);
}