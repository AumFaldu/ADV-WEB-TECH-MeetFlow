"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth, requirePermission } from "../lib/auth";
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

export async function createMeeting(formData: FormData) {
  const user = await requireAuth();
  await requirePermission("CREATE_MEETING");
  const staffId = user.staffId ?? null;

  if (user.role !== "ADMIN" && !staffId) {
    throw new Error("StaffID not found in session");
  }

  const meetingDate = formData.get("MeetingDate") as string;
  const meetingTypeID = Number(formData.get("MeetingTypeID"));
  const meetingDescription = (formData.get("MeetingDescription") as string) || "";

  const file = formData.get("DocumentFile") as File | null;
  let documentPath = "";

  if (file && file.size > 0) {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds the 5 MB limit.");
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error("Invalid file type. Only PDF or Word documents are allowed.");
    }

    // --- Cloudinary Upload Logic ---
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique name to prevent caching issues
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniquePublicId = `${Date.now()}-${safeName}`;

    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "meetflow/meetings",
          resource_type: "raw", // Required for PDF/Word
          public_id: uniquePublicId,
          access_mode: "public",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    documentPath = uploadResult.secure_url;
    // -------------------------------
  }

  // Create the meeting exactly like your original logic
  const meeting = await prisma.meetings.create({
    data: {
      MeetingDate: new Date(meetingDate),
      MeetingTypeID: meetingTypeID,
      MeetingDescription: meetingDescription,
      DocumentPath: documentPath,
    },
  });

  // Create the meeting member if staffId exists
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
