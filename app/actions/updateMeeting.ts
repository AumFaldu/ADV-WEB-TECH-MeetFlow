"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/app/lib/cloudinary";
import { requirePermission } from "../lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

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

    // Delete existing file from Cloudinary if present
    if (existingPath) {
      try {
        const urlParts = existingPath.split("/");
        const fileWithExt = urlParts[urlParts.length - 1];
        const publicId = `meetflow/meetings/${fileWithExt.substring(
          0,
          fileWithExt.lastIndexOf(".")
        )}`;

        await cloudinary.uploader.destroy(publicId, {
          resource_type: "raw",
        });
      } catch (err) {
        console.log("Old file delete failed:", err);
      }
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const originalName = file.name.replace(/\s+/g, "_");
    const resourceType = file.type.startsWith("image/") ? "image" : "raw";

    // Upload new file to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "meetflow/meetings",
            resource_type: resourceType,
            public_id: originalName.replace(/\.[^/.]+$/, ""),
            overwrite: true,
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
      VenueID: venueID,
      DocumentPath: documentPath,
    },
  });

  // Revalidate meetings path and redirect
  revalidatePath("/meetings");
  redirect("/meetings");
}
