"use client";

import { useState, useEffect, createContext, useContext } from "react";
import "./globals.css";

const DarkModeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const useDarkMode = () => useContext(DarkModeContext);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(saved === "true");
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <html lang="en">
        <head>
          <link
          rel="stylesheet"
          href="https://cdn.datatables.net/2.0.8/css/dataTables.dataTables.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.dataTables.min.css"
        />
        </head>
        <body className="transition-colors">
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
            {children}
          </div>
        </body>
      </html>
    </DarkModeContext.Provider>
  );
}