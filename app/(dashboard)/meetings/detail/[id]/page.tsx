import { requireAuth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export default async function MeetingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;
  const meetingId = Number(id);

  const meeting = await prisma.meetings.findUnique({
    where: { MeetingID: meetingId },
    include: {
      meetingtype: true,
      venue: true,
      meetingmembers: {
        include: {
          staff: true,
        },
      },
    },
  });

  if (!meeting)
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-gray-500 dark:text-gray-400">
          Meeting not found.
        </p>
      </div>
    );

  const now = new Date();
  const meetingDate = new Date(meeting.MeetingDate);
  const isStaff = user.role?.toUpperCase() === "STAFF";

  if (isStaff) {
    const isAssigned = meeting.meetingmembers.some(
      (m) => m.StaffID === user.staffId
    );

    if (!isAssigned) {
      return (
        <div className="max-w-3xl mx-auto">
          <p className="text-red-500">Access denied.</p>
        </div>
      );
    }
  }

  const visibleMembers = isStaff
    ? meeting.meetingmembers.filter(
        (m) => m.StaffID === user.staffId
      )
    : meeting.meetingmembers;

  let status = "";
  let badgeClass = "";

  if (meeting.IsCancelled) {
    status = "Cancelled";
    badgeClass =
      "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
  } else if (meetingDate < now) {
    status = "Completed";
    badgeClass =
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  } else {
    status = "Upcoming";
    badgeClass =
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">
          Meeting Details
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Detailed information about this meeting
        </p>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 space-y-6 transition-colors">
        <Info label="Meeting ID">
          {meeting.MeetingID}
        </Info>

        <Info label="Date & Time">
          {new Date(meeting.MeetingDate).toLocaleString()}
        </Info>

        <Info label="Meeting Type">
          {meeting.meetingtype?.MeetingTypeName ?? "N/A"}
        </Info>

        <Info label="Venue">
          {meeting.venue?.VenueName ?? "Not assigned"}
          {meeting.venue?.Location
            ? ` — ${meeting.venue.Location}`
            : ""}
        </Info>

        <Info label="Description">
          {meeting.MeetingDescription || "—"}
        </Info>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Document
          </p>
          {meeting.DocumentPath ? (
            <a
              href={meeting.DocumentPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-indigo-600 hover:underline"
            >
              View / Download
            </a>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No document uploaded
            </p>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Status
          </p>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass}`}
          >
            {status}
          </span>
        </div>

        {meeting.IsCancelled &&
          meeting.CancellationReason && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Cancellation Reason
              </p>
              <p className="text-red-600 dark:text-red-400">
                {meeting.CancellationReason}
              </p>
            </div>
          )}

        {/* Members */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {isStaff
              ? "Your Attendance"
              : "Assigned Members"}
          </p>

          {visibleMembers.length > 0 ? (
            <ul className="space-y-2">
              {visibleMembers.map((member) => {
                let attendanceLabel = "";
                let attendanceClass = "";

                if (
                  !meeting.IsCancelled &&
                  meetingDate < now
                ) {
                  if (member.IsPresent === true) {
                    attendanceLabel = "Present";
                    attendanceClass =
                      "text-green-600 dark:text-green-400";
                  } else if (member.IsPresent === false) {
                    attendanceLabel = "Absent";
                    attendanceClass =
                      "text-red-600 dark:text-red-400";
                  } else {
                    attendanceLabel = "Not Marked";
                    attendanceClass =
                      "text-gray-500 dark:text-gray-400";
                  }
                }

                return (
                  <li
                    key={member.MeetingMemberID}
                    className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <span className="text-gray-800 dark:text-gray-200">
                      {member.staff.StaffName}
                      {!meeting.IsCancelled &&
                        meetingDate < now &&
                        member.Remarks && (
                          <span className="text-gray-500 dark:text-gray-400 ml-2">
                            ({member.Remarks})
                          </span>
                        )}
                    </span>

                    {!meeting.IsCancelled &&
                      meetingDate < now && (
                        <span
                          className={`text-sm font-medium ${attendanceClass}`}
                        >
                          {attendanceLabel}
                        </span>
                      )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No members assigned
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Small Reusable UI ---------- */

function Info({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </p>
      <p className="text-gray-900 dark:text-gray-100">
        {children}
      </p>
    </div>
  );
}
