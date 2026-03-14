import Link from "next/link";
import MeetingsTable from "./MeetingsTable";
import {
  Pencil,
  Plus,
  Eye,
  Users,
  CheckSquare,
  BarChart3,
} from "lucide-react";
import { getMeetings, MeetingWithType } from "@/app/actions/meeting";
import CancelMeetingButton from "./CancelMeetingButton";
import { getAuthUser } from "@/app/lib/auth";
import { hasPermission } from "@/app/lib/rbac";

export default async function MeetingsPage() {
  const user = await getAuthUser();
  const canCreateMeeting = user && hasPermission(user.role, "CREATE_MEETING");
const canEditMeeting = user && hasPermission(user.role, "EDIT_MEETING");
const canCancelMeeting = user && hasPermission(user.role, "CANCEL_MEETING");
const canAddParticipant = user && hasPermission(user.role, "ADD_PARTICIPANT");
const canMarkAttendance = user && hasPermission(user.role, "MARK_ATTENDANCE");
const canViewSummary = user && hasPermission(user.role, "VIEW_REPORT");
  const meetings : MeetingWithType[] = await getMeetings();

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Meetings</h1>
        {canCreateMeeting && (
        <Link
          href="/meetings/create"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Add Meeting
        </Link>
        )
        }
      </div>
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700">
        <MeetingsTable>
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-sm uppercase text-gray-700 dark:text-gray-300">
              <th className="px-4 py-3 text-center">Date</th>
              <th className="px-4 py-3 text-center">Type</th>
              <th className="px-4 py-3 text-center">Description</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {meetings.map((meeting) => {
              const now = new Date();
              const meetingDate = new Date(meeting.MeetingDate);

              let status = "";
              let statusClass = "";
              const isCompleted =
                !meeting.IsCancelled && meetingDate < now;

              if (meeting.IsCancelled) {
                status = "Cancelled";
                statusClass = "text-red-600";
              } else if (meetingDate < now) {
                status = "Completed";
                statusClass = "text-blue-600";
              } else {
                status = "Upcoming";
                statusClass = "text-green-600";
              }

              return (
                <tr
                  key={meeting.MeetingID}
                  className="border-t border-gray-200 dark:border-gray-700  text-center"
                >
                  {/* Date */}
                  <td className="px-4 py-3 text-center" data-order={meetingDate.getTime()}>
                    {meetingDate.toLocaleDateString()}
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3 text-center">
                    {meeting.meetingtype?.MeetingTypeName}
                  </td>

                  {/* Description */}
                  <td className="px-4 py-3 text-center">
                    {meeting.MeetingDescription || "-"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`${statusClass} font-semibold`}
                    >
                      {status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-4">

                      {/* View */}
                      <Link
                        href={`/meetings/detail/${meeting.MeetingID}`}
                        className="text-blue-600 hover:scale-110 transition"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </Link>

                      {/* Edit */}
                      {canEditMeeting && (
                      <Link
                        href={`/meetings/edit/${meeting.MeetingID}`}
                        className="text-indigo-600 hover:scale-110 transition"
                        title="Edit Meeting"
                      >
                        <Pencil size={18} />
                      </Link>
                      )}
                      {/* Add Members */}
                      {!meeting.IsCancelled && canAddParticipant && (
                        <Link
                          href={`/meetings/members/${meeting.MeetingID}`}
                          className="text-purple-600 hover:scale-110 transition"
                          title="Add Members"
                        >
                          <Users size={18} />
                        </Link>
                      )}

                      {/* Attendance */}
                      {!meeting.IsCancelled && canMarkAttendance && (
                        <Link
                          href={`/meetings/attendance/${meeting.MeetingID}`}
                          className="text-green-600 hover:scale-110 transition"
                          title="Mark Attendance"
                        >
                          <CheckSquare size={18} />
                        </Link>
                      )}

                      {/* Attendance Summary (Only Completed) */}
                      {isCompleted && canViewSummary && (
                        <Link
                          href={`/meetings/summary/${meeting.MeetingID}`}
                          className="text-orange-600 hover:scale-110 transition"
                          title="Attendance Summary"
                        >
                          <BarChart3 size={18} />
                        </Link>
                      )}

                      {/* Cancel */}
                      {!meeting.IsCancelled && canCancelMeeting && (
                      <CancelMeetingButton
                        meetingID={meeting.MeetingID}
                      />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </MeetingsTable>
      </div>
    </div>
  );
}