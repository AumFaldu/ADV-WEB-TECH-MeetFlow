"use client";

import { saveMembers } from "./action";

interface Props {
  meetingID: number;
  staff: any[];
  existingStaffIDs: number[];
}

export default function MembersForm({
  meetingID,
  staff,
  existingStaffIDs,
}: Props) {
  const action = saveMembers.bind(null, meetingID);

  return (
    <div className="w-full px-6">
      <form
        action={action}
        className="card w-full max-w-4xl mx-auto p-8 space-y-6"
      >
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">
            Assign Members
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select staff who will attend this meeting
          </p>
        </div>

        {/* List */}
        <div className="space-y-3 max-h-[540px] overflow-y-auto pr-2">
          {staff.map((member) => {
            const checked = existingStaffIDs.includes(member.StaffID);

            return (
              <label
                key={member.StaffID}
                className="flex items-center justify-between
                bg-gray-50 dark:bg-gray-700
                border border-gray-200 dark:border-gray-600
                hover:border-indigo-400 dark:hover:border-indigo-500
                px-6 py-5 rounded-2xl cursor-pointer transition"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    name="staff"
                    value={member.StaffID}
                    defaultChecked={checked}
                    className="w-5 h-5 accent-indigo-600"
                  />

                  <span className="text-base font-medium text-gray-800 dark:text-gray-100">
                    {member.StaffName}
                  </span>
                </div>

                {checked && (
                  <span className="text-xs px-3 py-1.5 rounded-full
                  bg-indigo-100 text-indigo-700
                  dark:bg-indigo-900/40 dark:text-indigo-300">
                    Added
                  </span>
                )}
              </label>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-3">
          <button type="submit" className="btn-primary">
            Save Members
          </button>

          <a href="/meetings" className="btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}