"use client";

interface FooterProps {
  darkMode?: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
  return (
    <footer
      className={`mt-auto px-6 py-3 text-xs flex justify-between items-center transition-colors
        ${darkMode ? "bg-gray-900 text-gray-400" : "bg-white text-gray-500"}`}
    >
      <span>
        © {new Date().getFullYear()} <strong>MeetFlow</strong> — MOM System
      </span>
      <span className="italic opacity-80">Crafted by Aum Faldu</span>
    </footer>
  );
}