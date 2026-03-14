import { prisma } from "@/app/lib/prisma";
import { saveAttendance } from "@/app/actions/attendance";

export default async function AttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meetingID = Number(id);

  const members = await prisma.meetingmember.findMany({
    where: { MeetingID: meetingID },
    include: { staff: true },
  });

  if (!members.length) {
    return (
      <div className="p-6">
        <p className="text-gray-500 dark:text-gray-400">
          No members found for this meeting.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-6">
      <div className="card max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">
            Mark Attendance
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update presence status and remarks for meeting members
          </p>
        </div>

        <form action={saveAttendance} className="space-y-4">
          <input type="hidden" name="meetingID" value={meetingID} />

          {/* Members List */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2">
            {members.map((member) => {
              const present = member.IsPresent ?? false;

              return (
                <div
                  key={member.MeetingMemberID}
                  className={`flex items-center justify-between
                  border rounded-2xl px-6 py-5 transition
                  bg-gray-50 dark:bg-gray-700
                  border-gray-200 dark:border-gray-600
                  hover:border-indigo-400 dark:hover:border-indigo-500`}
                >
                  {/* Left Section */}
                  <div className="flex flex-col gap-2 w-full max-w-xl">
                    <span className="text-base font-medium text-gray-800 dark:text-gray-100">
                      {member.staff?.StaffName || "Staff"}
                    </span>

                    <input
                      type="text"
                      name={`remarks_${member.MeetingMemberID}`}
                      defaultValue={member.Remarks ?? ""}
                      placeholder="Optional remark (Late / Leave / Medical)"
                      className="input"
                    />
                  </div>

                  {/* Right Section */}
                  <label className="flex items-center gap-3 ml-6 cursor-pointer">
                    <input
                      type="checkbox"
                      name={`present_${member.MeetingMemberID}`}
                      defaultChecked={present}
                      className="w-5 h-5 accent-indigo-600"
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Present
                    </span>
                  </label>
                </div>
              );
            })}
          </div>

          {/* Sticky Actions */}
          <div className="pt-6 flex gap-3">
            <button type="submit" className="btn-primary">
              Save Attendance
            </button>

            <a href="/meetings" className="btn-secondary">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}