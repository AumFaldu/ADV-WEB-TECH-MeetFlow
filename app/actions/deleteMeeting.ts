"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/app/lib/cloudinary";
import { requirePermission } from "../lib/auth";

export async function deleteMeeting(meetingID: number, reason: string) {

  await requirePermission("CANCEL_MEETING");

  if (!meetingID) {
    throw new Error("Meeting ID is required");
  }

  const meeting = await prisma.meetings.findUnique({
    where: { MeetingID: meetingID },
    select: { DocumentPath: true },
  });

  if (meeting?.DocumentPath) {
    try {
      const parts = meeting.DocumentPath.split("/");
      const fileName = parts[parts.length - 1];
      const publicId = `meetflow/meetings/${fileName.split(".")[0]}`;

      await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw",
      });
    } catch (err) {
      console.log("Cloudinary delete failed", err);
    }
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
