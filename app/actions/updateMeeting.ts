"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
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
      throw new Error("Invalid file type. Only PDF, Word, or images allowed.");
    }

    // Safe filename and folder structure
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const dateFolder = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const uploadDir = path.join(process.cwd(), "public/uploads/meetings", dateFolder);

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${uuidv4()}-${safeName}`;
    const uploadPath = path.join(uploadDir, fileName);

    // Write new file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(uploadPath, buffer);

    documentPath = `/uploads/meetings/${dateFolder}/${fileName}`;
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