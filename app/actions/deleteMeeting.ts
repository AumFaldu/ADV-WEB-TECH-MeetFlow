"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "../lib/auth";

export async function deleteMeeting(meetingID: number, reason: string) {
  const user = requirePermission("CANCEL_MEETING")
  if (!meetingID) {
    throw new Error("Meeting ID is required");
  }

  await prisma.meetings.update({
    where: { MeetingID: meetingID },
    data: {
      IsCancelled: true,
      CancellationReason: reason,
      CancellationDateTime: new Date(),
    },
  });

  revalidatePath("/meetings");
  redirect("/meetings");
}
