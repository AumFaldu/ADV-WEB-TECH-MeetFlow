"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "../lib/auth";
import { v2 as cloudinary } from "cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function updateMeeting(formData: FormData) {
  await requirePermission("EDIT_MEETING");

  const meetingID = Number(formData.get("MeetingID"));
  const meetingDate = formData.get("MeetingDate") as string;
  const meetingTypeID = Number(formData.get("MeetingTypeID"));
  const meetingDescription = (formData.get("MeetingDescription") as string) || "";
  const venueIDRaw = formData.get("VenueID");
  const venueID = venueIDRaw ? Number(venueIDRaw) : null;

  // File handling
  const file = formData.get("DocumentFile") as File | null;
  const existingPath = formData.get("ExistingDocumentPath") as string;
  let documentPath = existingPath || "";

  if (file && file.size > 0) {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds 5 MB limit.");
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error("Invalid file type. Only PDF or Word documents allowed.");
    }

    // --- Cloudinary Upload Logic ---
    
    // 1. Cleanup old file from Cloudinary if it exists
    if (existingPath && existingPath.includes("cloudinary")) {
      try {
        const fileName = existingPath.split("/").pop();
        if (fileName) {
          // In Cloudinary 'raw' mode, the public_id includes the extension
          await cloudinary.uploader.destroy(`meetflow/meetings/${fileName}`, { 
            resource_type: "raw" 
          });
        }
      } catch (err) {
        console.error("Cloudinary cleanup failed:", err);
      }
    }

    // 2. Prepare the new file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Generate a unique ID for the new file
    const safeName = file.name.replace(/\s+/g, "_");
    const uniquePublicId = `${Date.now()}-${safeName}`;

    // 4. Upload to Cloudinary stream
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "meetflow/meetings",
          resource_type: "raw",
          public_id: uniquePublicId,
          access_mode: "public",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    documentPath = uploadResult.secure_url;
    // --------------------------------
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
  revalidatePath(`/meetings/${meetingID}`);
  redirect("/meetings");
}
