import { notFound } from "next/navigation";
import { getMeetingSummary } from "@/app/actions/meeting";

export default async function AttendanceSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meetingID = Number(id);

  const data = await getMeetingSummary(meetingID);

  if (!data) return notFound();

  const { members } = data;

  const total = members.length;
  const present = members.filter((m: any) => m.IsPresent).length;
  const absent = total - present;
  const percentage =
    total > 0 ? ((present / total) * 100).toFixed(1) : "0";

  return (
    <div className="w-full px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold">
            Attendance Summary
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview of meeting attendance statistics
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="card text-center p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Members
            </p>
            <p className="text-3xl font-semibold mt-1">
              {total}
            </p>
          </div>

          <div className="card text-center p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Present
            </p>
            <p className="text-3xl font-semibold text-green-600 mt-1">
              {present}
            </p>
          </div>

          <div className="card text-center p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Absent
            </p>
            <p className="text-3xl font-semibold text-red-600 mt-1">
              {absent}
            </p>
          </div>

          <div className="card text-center p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Attendance %
            </p>
            <p className="text-3xl font-semibold text-indigo-600 mt-1">
              {percentage}%
            </p>
          </div>
        </div>

        {/* Members Table */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr className="text-left">
                  <th className="px-6 py-4 font-medium">Staff Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Remarks</th>
                </tr>
              </thead>

              <tbody>
                {members.map((member: any) => (
                  <tr
                    key={member.MeetingMemberID}
                    className="border-t border-gray-200 dark:border-gray-700
                    hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-6 py-4 font-medium">
                      {member.staff.StaffName}
                    </td>

                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {member.staff.EmailAddress}
                    </td>

                    <td className="px-6 py-4">
                      {member.IsPresent ? (
                        <span className="px-3 py-1 text-xs rounded-full
                        bg-green-100 text-green-700
                        dark:bg-green-900/40 dark:text-green-300">
                          Present
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs rounded-full
                        bg-red-100 text-red-700
                        dark:bg-red-900/40 dark:text-red-300">
                          Absent
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {member.Remarks || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}