"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/app/lib/cloudinary";
import { requirePermission } from "../lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/gif",
];

export async function updateMeeting(formData: FormData) {
  await requirePermission("EDIT_MEETING");

  const meetingID = Number(formData.get("MeetingID"));
  const meetingDate = formData.get("MeetingDate") as string;
  const meetingTypeID = Number(formData.get("MeetingTypeID"));
  const meetingDescription =
    (formData.get("MeetingDescription") as string) || "";

  const venueIDRaw = formData.get("VenueID");
  const venueID = venueIDRaw ? Number(venueIDRaw) : null;

  const file = formData.get("DocumentFile") as File | null;
  const existingPath = formData.get("ExistingDocumentPath") as string;

  let documentPath = existingPath || "";

  if (file && file.size > 0) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds 5MB limit.");
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error("Invalid file type.");
    }

    if (existingPath) {
      try {
        const parts = existingPath.split("/");
        const fileName = parts[parts.length - 1];
        const publicId = `meetflow/meetings/${fileName.split(".")[0]}`;

        await cloudinary.uploader.destroy(publicId, {
          resource_type: "raw",
        });
      } catch (err) {
        console.log("Old file delete failed", err);
      }
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

  await prisma.meetings.update({
    where: { MeetingID: meetingID },
    data: {
      MeetingDate: new Date(meetingDate),
      MeetingTypeID: meetingTypeID,
      MeetingDescription: meetingDescription,
      DocumentPath: documentPath,
      VenueID: venueID,
    },
  });

  revalidatePath("/meetings");
  redirect("/meetings");
}
