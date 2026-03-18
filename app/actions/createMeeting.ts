"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "../lib/auth";
import { v2 as cloudinary } from "cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Only allow documents
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

export async function createMeeting(formData: FormData) {
  await requirePermission("CREATE_MEETING");

  const meetingDate = formData.get("MeetingDate") as string;
  const meetingTypeID = Number(formData.get("MeetingTypeID"));
  const meetingDescription = (formData.get("MeetingDescription") as string) || "";
  const venueIDRaw = formData.get("VenueID");
  const venueID = venueIDRaw ? Number(venueIDRaw) : null;

  const file = formData.get("DocumentFile") as File | null;
  let documentPath = "";

  if (file && file.size > 0) {
    if (file.size > MAX_FILE_SIZE) throw new Error("File size exceeds 5 MB");
    if (!ALLOWED_MIME_TYPES.includes(file.type)) throw new Error("Invalid file type");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload as raw file directly
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "meetflow/meetings",
            resource_type: "raw", // only raw files
            public_id: file.name.replace(/\s+/g, "_"),
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

  await prisma.meetings.create({
    data: {
      MeetingDate: new Date(meetingDate),
      MeetingTypeID: meetingTypeID,
      MeetingDescription: meetingDescription,
      VenueID: venueID,
      DocumentPath: documentPath,
    },
  });

  revalidatePath("/meetings");
  redirect("/meetings");
}
