"use client";

import { useEffect, useRef } from "react";

export default function MeetingsTable({
  children,
}: {
  children: React.ReactNode;
}) {
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    let table: any;

    const load = async () => {
      const $ = (await import("jquery")).default;
      await import("datatables.net-dt");
      await import("datatables.net-responsive")

      if (!tableRef.current) return;

      table = $(tableRef.current).DataTable({
        destroy: true,
        pageLength: 10,
        ordering: true,
        searching: true,
        info: true,
        lengthChange: true,
        responsive: true,
        order: [[0,"desc"]],
      });
    };
    
    load();

    return () => {
      if (table) table.destroy();
    };
  }, []);

  return (
  <div className="datatable-wrapper">
    <table ref={tableRef} className="display w-full">
      {children}
    </table>
  </div>
);
}