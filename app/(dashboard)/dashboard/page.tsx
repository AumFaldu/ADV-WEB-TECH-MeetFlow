import { getDashboardData } from "@/app/actions/dashboard";
import { requirePermission } from "@/app/lib/auth";
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requirePermission("VIEW_DASHBOARD");
  const {
    upcomingMeetings,
    completedMeetings,
    cancelledMeetings,
    pendingMOM,
    pendingMOMCount,
    recentMOMs,
  } = await getDashboardData();

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Quick snapshot of your meetings and MOM activities
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Upcoming Meetings"
          value={upcomingMeetings.length.toString()}
          icon={<CalendarDays />}
          color="indigo"
        />
        <StatCard
          title="Completed Meetings"
          value={completedMeetings.toString()}
          icon={<CheckCircle />}
          color="green"
        />
        <StatCard
          title="Cancelled Meetings"
          value={cancelledMeetings.toString()}
          icon={<XCircle />}
          color="red"
        />
        <StatCard
          title="Pending MOM Upload"
          value={pendingMOMCount.toString()}
          icon={<Clock />}
          color="yellow"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Upcoming Meetings */}
        <Card className="xl:col-span-2">
          <CardHeader
            title="Upcoming Meetings"
            subtitle="Your scheduled meetings"
          />

          <div className="divide-y dark:divide-gray-700">
            {upcomingMeetings.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">
                No upcoming meetings
              </p>
            ) : (
              upcomingMeetings.slice(0, 5).map((m) => (
                <div
                  key={m.MeetingID}
                  className="flex items-center justify-between py-4"
                >
                  <div>
                    <p className="font-medium">
                      {m.MeetingDescription ?? "Meeting"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(m.MeetingDate).toLocaleString()} •{" "}
                      {m.meetingtype.MeetingTypeName}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                    Upcoming
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Pending MOM Info */}
<Card>
  <CardHeader
    title="Pending MOM Upload"
    subtitle="Meetings that need documentation"
  />

  {pendingMOM.length === 0 ? (
    <p className="text-sm text-gray-500">
      All meetings are documented 🎉
    </p>
  ) : (
    <div className="divide-y dark:divide-gray-700">
      {pendingMOM.slice(0, 5).map((m: any) => (
        <div key={m.MeetingID} className="py-4">
          <p className="font-medium">
            {m.MeetingDescription ?? "Meeting"}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(m.MeetingDate).toLocaleDateString()} •{" "}
            {m.meetingtype.MeetingTypeName}
          </p>
        </div>
      ))}
    </div>
  )}
</Card>
      </div>

      {/* Recent MOMs */}
      <Card>
        <CardHeader
          title="Recent Minutes of Meetings"
          subtitle="Latest documented MOMs"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700 text-left">
                <th className="py-3">Meeting</th>
                <th>Date</th>
                <th>Type</th>
                <th>Document</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {recentMOMs.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-gray-500"
                  >
                    No MOM documents available
                  </td>
                </tr>
              ) : (
                recentMOMs.map((row) => (
                  <tr key={row.MeetingID}>
                    <td className="py-3 font-medium">
                      {row.MeetingDescription ?? "Meeting"}
                    </td>
                    <td>
                      {new Date(row.MeetingDate).toLocaleDateString()}
                    </td>
                    <td>{row.meetingtype.MeetingTypeName}</td>
                    <td>
                      <a
                        href={row.DocumentPath ?? "#"}
                        target="_blank"
                        className="flex items-center gap-1 text-indigo-600 hover:underline"
                      >
                        <FileText size={16} />
                        View MOM
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Reusable UI Components ---------------- */

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "indigo" | "green" | "red" | "yellow";
}) {
  const colorMap: Record<string, string> = {
    indigo: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/40",
    green: "text-green-600 bg-green-100 dark:bg-green-900/40",
    red: "text-red-600 bg-red-100 dark:bg-red-900/40",
    yellow: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/40",
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl ${colorMap[color]}`}
      >
        {icon}
      </div>
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-white dark:bg-gray-800 shadow-sm p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
