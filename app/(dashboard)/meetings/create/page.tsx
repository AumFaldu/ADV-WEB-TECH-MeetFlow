import { createMeeting } from "@/app/actions/createMeeting";
import { getMeetingTypes } from "@/app/actions/meetingType";
import { getVenues } from "@/app/actions/venue";
import { requirePermission } from "@/app/lib/auth";

export default async function CreateMeetingPage() {
  await requirePermission("CREATE_MEETING");
  await requirePermission("VIEW_MEETING_TYPE");
  await requirePermission("VIEW_VENUE");

  const meetingTypes = await getMeetingTypes();
  const venues = await getVenues();

  return (
    <div className="page-container">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">
          Create Meeting
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Schedule a new meeting and assign details
        </p>
      </div>

      {/* Form Card */}
      <form
        action={createMeeting}
        className="card p-8 space-y-5"
      >
        {/* Date & Time */}
        <div>
          <label className="label">
            Date & Time
          </label>
          <input
            type="datetime-local"
            name="MeetingDate"
            className="input"
            required
          />
        </div>

        {/* Meeting Type */}
        <div>
          <label className="label">
            Meeting Type
          </label>
          <select
            name="MeetingTypeID"
            className="input"
            required
          >
            <option value="">
              Select meeting type
            </option>

            {meetingTypes.map((mt) => (
              <option key={mt.id} value={mt.id}>
                {mt.name}
              </option>
            ))}
          </select>
        </div>

        {/* Venue */}
        <div>
          <label className="label">
            Venue
          </label>
          <select
            name="VenueID"
            className="input"
          >
            <option value="">
              Select venue
            </option>

            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="label">
            Description
          </label>
          <textarea
            name="MeetingDescription"
            rows={4}
            className="input"
          />
        </div>

        {/* Document Upload */}
        <div>
          <label className="label">
            Document
          </label>
          <input
            type="file"
            name="DocumentFile"
            className="input"
            accept=".pdf,.doc,.docx"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Optional — upload meeting agenda or notes
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="btn-primary"
          >
            Create Meeting
          </button>

          <a
            href="/meetings"
            className="btn-secondary"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}