"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
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
      throw new Error("Invalid file type. Only PDF, Word, or images are allowed.");
    }

    // Create safe file name
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const dateFolder = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const uploadDir = path.join(process.cwd(), "public/uploads/meetings", dateFolder);

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${uuidv4()}-${safeName}`;
    const uploadPath = path.join(uploadDir, fileName);

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(uploadPath, buffer);

    documentPath = `/uploads/meetings/${dateFolder}/${fileName}`;
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