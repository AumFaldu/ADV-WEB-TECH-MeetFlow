import { prisma } from "@/app/lib/prisma";
import { updateMeeting } from "@/app/actions/updateMeeting";
import { requirePermission } from "@/app/lib/auth";

export default async function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  await requirePermission("EDIT_MEETING");

  const { id } = await params;

  const meeting = await prisma.meetings.findFirst({
    where: { MeetingID: Number(id) },
  });

  const venues = await prisma.venue.findMany({
    orderBy: { VenueName: "asc" },
  });

  if (!meeting) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-red-600 dark:text-red-400 font-medium">
          Meeting not found
        </p>
      </div>
    );
  }

  const meetingTypes = await prisma.meetingtype.findMany({
    orderBy: { MeetingTypeName: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">
          Edit Meeting
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Update meeting details and attachments
        </p>
      </div>

      {/* Form Card */}
      <form
        action={updateMeeting}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 space-y-5 transition-colors"
      >
        <input
          type="hidden"
          name="MeetingID"
          value={meeting.MeetingID}
        />

        {/* Date */}
        <Field label="Meeting Date">
          <input
            type="date"
            name="MeetingDate"
            defaultValue={
              meeting.MeetingDate
                .toISOString()
                .split("T")[0]
            }
            className="input"
            required
          />
        </Field>

        {/* Type */}
        <Field label="Meeting Type">
          <select
            name="MeetingTypeID"
            defaultValue={meeting.MeetingTypeID}
            className="input"
            required
          >
            <option value="">Select meeting type</option>
            {meetingTypes.map((type) => (
              <option
                key={type.MeetingTypeID}
                value={type.MeetingTypeID}
              >
                {type.MeetingTypeName}
              </option>
            ))}
          </select>
        </Field>

        {/* Venue */}
        <Field label="Venue">
          <select
            name="VenueID"
            defaultValue={meeting.VenueID || ""}
            className="input"
          >
            <option value="">Select venue</option>
            {venues.map((venue) => (
              <option
                key={venue.VenueID}
                value={venue.VenueID}
              >
                {venue.VenueName}
              </option>
            ))}
          </select>
        </Field>

        {/* Description */}
        <Field label="Meeting Description">
          <textarea
            name="MeetingDescription"
            defaultValue={
              meeting.MeetingDescription || ""
            }
            rows={4}
            className="input"
          />
        </Field>

        {/* Document */}
        <div>
          <label className="label">
            Document
          </label>

          {meeting.DocumentPath && (
            <p className="text-sm mb-2">
              Current File:
              <a
                href={meeting.DocumentPath}
                target="_blank"
                className="text-indigo-600 dark:text-indigo-400 underline ml-1"
              >
                View Document
              </a>
            </p>
          )}

          <input
            type="file"
            name="DocumentFile"
            className="input"
          />

          <input
            type="hidden"
            name="ExistingDocumentPath"
            value={meeting.DocumentPath || ""}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium"
          >
            Update Meeting
          </button>

          <a
            href="/meetings"
            className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}

/* ---------- Reusable UI ---------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label">
        {label}
      </label>
      {children}
    </div>
  );
}