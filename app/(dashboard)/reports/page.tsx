import { getMeetingSummary } from "@/app/actions/report";
import Link from "next/link";

export default async function ReportsPage() {
  const data = await getMeetingSummary();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        Meeting Summary Report
      </h1>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/reports/meetingwise"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          View Meeting Wise Report
        </Link>

        <a
          href="/api/reports/excel?type=summary"
          className="btn-secondary">
          Export to Excel
        </a>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card title="Total Meetings" value={data.totalMeetings} color="bg-purple-100 dark:bg-purple-900/40" />
        <Card title="Upcoming" value={data.upcomingMeetings} color="bg-blue-100 dark:bg-blue-900/40" />
        <Card title="Completed" value={data.completedMeetings} color="bg-green-100 dark:bg-green-900/40" />
        <Card title="Cancelled" value={data.cancelledMeetings} color="bg-red-100 dark:bg-red-900/40" />
        <Card title="Attendance %" value={`${data.attendancePercentage}%`} color="bg-lime-100 dark:bg-lime-900/40" />
      </div>
    </div>
  );
}

type CardProps = {
  title: string;
  value: string | number;
  color: string;
};

function Card({ title, value, color }: CardProps) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 ${color}
      hover:shadow-lg transition duration-300`}
    >
      <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {title}
      </h2>
      <p className="text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}