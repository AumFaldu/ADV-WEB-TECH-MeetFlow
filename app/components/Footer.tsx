"use client";

interface FooterProps {
  darkMode?: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
  return (
    <footer
      className={`px-8 py-3 text-xs border-t
      ${darkMode
        ? "border-slate-800 text-slate-500"
        : "border-slate-200 text-slate-400"}
    `}
    >
      © {new Date().getFullYear()} MeetFlow
    </footer>
  );
}
