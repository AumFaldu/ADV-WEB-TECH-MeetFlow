"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/app/lib/cloudinary";
import { requireAuth, requirePermission } from "../lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/gif",
];

export async function createMeeting(formData: FormData) {
  const user = await requireAuth();
  await requirePermission("CREATE_MEETING");

  const staffId = user.staffId ?? null;

  if (user.role !== "ADMIN" && !staffId) {
    throw new Error("StaffID not found in session");
  }

  const meetingDate = formData.get("MeetingDate") as string;
  const meetingTypeID = Number(formData.get("MeetingTypeID"));
  const meetingDescription =
    (formData.get("MeetingDescription") as string) || "";

  const file = formData.get("DocumentFile") as File | null;

  let documentPath = "";
  if (file && file.size > 0) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds 5MB limit.");
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error("Invalid file type.");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "meetflow/meetings",
            resource_type: "raw",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    documentPath = uploadResult.secure_url;
  }

  const meeting = await prisma.meetings.create({
    data: {
      MeetingDate: new Date(meetingDate),
      MeetingTypeID: meetingTypeID,
      MeetingDescription: meetingDescription,
      DocumentPath: documentPath,
    },
  });
  if (staffId) {
    await prisma.meetingmember.create({
      data: {
        MeetingID: meeting.MeetingID,
        StaffID: staffId,
        IsPresent: true,
      },
    });
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}
