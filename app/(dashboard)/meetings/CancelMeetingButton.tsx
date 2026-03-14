"use client";

import { Trash2 } from "lucide-react";
import { deleteMeeting } from "@/app/actions/deleteMeeting";

export default function CancelMeetingButton({
  meetingID,
  disabled,
}: {
  meetingID: number;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={async () => {
        const confirmCancel = confirm(
          "Are you sure you want to cancel this meeting?"
        );
        if (!confirmCancel) return;

        const reason = prompt("Enter cancellation reason");
        if (!reason) return;

        await deleteMeeting(meetingID, reason);
      }}
      className={`${
        disabled
          ? "text-gray-400 cursor-not-allowed"
          : "text-red-600 hover:text-red-700"
      }`}
    >
      <Trash2 size={18} />
    </button>
  );
}
