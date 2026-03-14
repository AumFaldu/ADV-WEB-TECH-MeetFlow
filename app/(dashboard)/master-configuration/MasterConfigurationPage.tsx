"use client";

import { Plus, Edit3, Trash2 } from "lucide-react";
import { useState, useEffect, FormEvent, useRef } from "react";

import {
  getMeetingTypes,
  addMeetingType,
  updateMeetingType,
  deleteMeetingType,
} from "@/app/actions/meetingType";

import { deleteStaff, getStaff, updateStaff } from "@/app/actions/staff";

import {
  getDepartments,
  addDepartment,
  deleteDepartment,
  updateDepartment,
} from "@/app/actions/department";

import {
  getVenues,
  addVenue,
  deleteVenue,
  updateVenue,
} from "@/app/actions/venue";

export default function MasterConfigurationPage() {
  const [meetingTypes, setMeetingTypes] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);

  const [editItem, setEditItem] = useState<any>(null);

  useEffect(() => {
    async function load() {
      setMeetingTypes(await getMeetingTypes());
      setStaff(await getStaff());
      setDepartments(await getDepartments());
      setVenues(await getVenues());
    }
    load();
  }, []);

  const handleAdd = async (type: string, e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const fd = new FormData(e.currentTarget);

  if (type === "meetingType") {
    const newItem = await addMeetingType(fd);
    setMeetingTypes((p) => [...p, newItem]);
  }

  if (type === "department") {
    const newItem = await addDepartment(fd);
    setDepartments((p) => [...p, newItem]);
  }

  if (type === "venue") {
    const newItem = await addVenue(fd);
    setVenues((p) => [...p, newItem]);
  }

  e.currentTarget.reset();
};

  const handleDelete = async (type: string, id: number) => {
    if (type === "meetingType") {
      await deleteMeetingType(id);
      setMeetingTypes((p) => p.filter((x) => x.id !== id));
    }
    if (type === "staff") {
      await deleteStaff(id);
      setStaff((p) => p.filter((x) => x.id !== id));
    }
    if (type === "department") {
      await deleteDepartment(id);
      setDepartments((p) => p.filter((x) => x.id !== id));
    }
    if (type === "venue") {
      await deleteVenue(id);
      setVenues((p) => p.filter((x) => x.id !== id));
    }
  };

  const handleEditSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;

    const fd = new FormData(e.currentTarget);

    if (editItem.type === "meetingType") {
      await updateMeetingType(editItem.id, fd);
      setMeetingTypes((p) =>
        p.map((x) =>
          x.id === editItem.id
            ? { ...x, name: fd.get("name"), remarks: fd.get("remarks") }
            : x
        )
      );
    }

    if (editItem.type === "department") {
      await updateDepartment(editItem.id, fd);
      setDepartments((p) =>
        p.map((x) =>
          x.id === editItem.id
            ? { ...x, name: fd.get("name"), remarks: fd.get("remarks") }
            : x
        )
      );
    }

    if (editItem.type === "venue") {
      await updateVenue(editItem.id, fd);
      setVenues((p) =>
        p.map((x) =>
          x.id === editItem.id
            ? { ...x, name: fd.get("name"), location: fd.get("remarks") }
            : x
        )
      );
    }

    if (editItem.type === "staff") {
      await updateStaff(editItem.id, fd);
      const deptId = Number(fd.get("departmentId"));
      const deptName =
        departments.find((d) => d.id === deptId)?.name || "Not Assigned";

      setStaff((p) =>
        p.map((x) =>
          x.id === editItem.id
            ? {
                ...x,
                name: fd.get("name"),
                departmentName: deptName,
              }
            : x
        )
      );
    }

    setEditItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Master Configuration
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage Meeting Types, Staff, Departments and Venues
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MasterCard title="Meeting Types" onAdd={(e) => handleAdd("meetingType", e)}>
          <Table
            columns={["Name", "Remarks", "Actions"]}
            data={meetingTypes.map((x) => [x.name, x.remarks || "", x.id])}
            onDelete={(id) => handleDelete("meetingType", id)}
            onEdit={(r) =>
              setEditItem({ id: r[2], name: r[0], remarks: r[1], type: "meetingType" })
            }
          />
        </MasterCard>

        <MasterCard title="Staff">
          <Table
            columns={["Name", "Email", "Mobile", "Department", "Role", "Actions"]}
            data={staff.map((x) => [
              x.name,
              x.email,
              x.MobileNo,
              x.departmentName,
              x.role,
              x.id,
            ])}
            onDelete={(id) => handleDelete("staff", id)}
            onEdit={(r) =>
              setEditItem({
                id: r[5],
                name: r[0],
                departmentId: departments.find((d) => d.name === r[3])?.id,
                type: "staff",
              })
            }
          />
        </MasterCard>

        <MasterCard title="Departments" onAdd={(e) => handleAdd("department", e)}>
          <Table
            columns={["Name", "Remarks", "Actions"]}
            data={departments.map((x) => [x.name, x.remarks || "", x.id])}
            onDelete={(id) => handleDelete("department", id)}
            onEdit={(r) =>
              setEditItem({ id: r[2], name: r[0], remarks: r[1], type: "department" })
            }
          />
        </MasterCard>

        <MasterCard title="Venues" onAdd={(e) => handleAdd("venue", e)}>
          <Table
            columns={["Name", "Location", "Actions"]}
            data={venues.map((x) => [x.name, x.location || "", x.id])}
            onDelete={(id) => handleDelete("venue", id)}
            onEdit={(r) =>
              setEditItem({ id: r[2], name: r[0], remarks: r[1], type: "venue" })
            }
          />
        </MasterCard>
      </div>

      {editItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Edit</h3>

            <form onSubmit={handleEditSave} className="space-y-3">
              <input
                name="name"
                defaultValue={editItem.name}
                className="input"
                required
              />

              {(editItem.type === "meetingType" ||
                editItem.type === "department" ||
                editItem.type === "venue") && (
                <input
                  name="remarks"
                  defaultValue={editItem.remarks}
                  className="input"
                />
              )}

              {editItem.type === "staff" && (
                <select
                  name="departmentId"
                  defaultValue={editItem.departmentId}
                  className="input"
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MasterCard({ title, children, onAdd }: any) {
  const ref = useRef<HTMLFormElement>(null);

  return (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6">
    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
      {title}
    </h2>

    {onAdd && (
      <form ref={ref} onSubmit={(e) => onAdd(e)} className="flex flex-wrap gap-2 mb-4">
        <input name="name" placeholder="Name" className="input flex-1" required />
        <input name="remarks" placeholder="Remarks" className="input flex-1" />
        <button className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg">
          <Plus size={16} /> Add
        </button>
      </form>
    )}
    <div className="overflow-x-auto">
      {children}
    </div>
  </div>
);
}

function Table({ columns, data, onDelete, onEdit }: any) {
  return (
    <table className="w-full text-sm text-gray-700 dark:text-gray-200">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          {columns.map((c: any, i: number) => (
            <th key={i} className="py-2 px-3 text-center text-gray-500 dark:text-gray-400">
              {c}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((row: any, i: number) => (
          <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            {row.slice(0, -1).map((cell: any, j: number) => (
              <td key={j} className="py-2 px-3">
                {cell}
              </td>
            ))}
            <td className="py-2 px-3 flex gap-2 justify-center">
              {onEdit && (
                <button onClick={() => onEdit(row)}>
                  <Edit3 size={16} className="text-indigo-600 dark:text-indigo-400" />
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(row[row.length - 1])}>
                  <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}