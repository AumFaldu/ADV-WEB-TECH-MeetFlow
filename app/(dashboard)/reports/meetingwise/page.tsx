import { getMeetingWiseReport } from "@/app/actions/report";

export default async function MeetingWisePage() {
  const meetings = await getMeetingWiseReport();
  const now = new Date();

  return (
    <div className="w-full px-6 py-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              Meeting Wise Report
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Attendance statistics for each meeting
            </p>
          </div>

          <a
            href="/api/reports/excel?type=meetingwise"
            className="btn-secondary"
          >
            Export Excel
          </a>
        </div>

        {/* Table */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                <tr className="text-left">
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Venue</th>
                  <th className="px-6 py-4 font-medium text-center">Total</th>
                  <th className="px-6 py-4 font-medium text-center">Present</th>
                  <th className="px-6 py-4 font-medium text-center">Absent</th>
                  <th className="px-6 py-4 font-medium text-center">Attendance %</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {meetings.map((m) => {
                  const meetingDate = new Date(m.MeetingDate);

                  let status = "";
                  let badgeClass = "";

                  if (m.IsCancelled) {
                    status = "Cancelled";
                    badgeClass =
                      "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
                  } else if (meetingDate > now) {
                    status = "Upcoming";
                    badgeClass =
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
                  } else {
                    status = "Completed";
                    badgeClass =
                      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
                  }

                  return (
                    <tr
  key={m.MeetingID}
  className="border-t border-gray-200 dark:border-gray-700
  odd:bg-white even:bg-gray-50
  dark:odd:bg-gray-900 dark:even:bg-gray-800
  hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
>
                      <td className="px-6 py-4">
                        {meetingDate.toLocaleDateString("en-GB")}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {m.MeetingType}
                      </td>

                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {m.Venue}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {m.totalMembers}
                      </td>

                      <td className="px-6 py-4 text-center text-green-600 font-medium">
                        {m.presentMembers}
                      </td>

                      <td className="px-6 py-4 text-center text-red-600 font-medium">
                        {m.absentMembers}
                      </td>

                      <td
  className={`px-6 py-4 text-center font-semibold ${
    m.attendancePercentage >= 75
      ? "text-green-600"
      : m.attendancePercentage >= 50
      ? "text-yellow-600"
      : "text-red-600"
  }`}
>
  {m.attendancePercentage}%
</td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${badgeClass}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
}