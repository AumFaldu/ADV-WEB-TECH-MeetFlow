"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission, requireAuth } from "../lib/auth";
import { v2 as cloudinary } from "cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
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
  const user = await requireAuth();
  await requirePermission("EDIT_MEETING");

  const meetingID = Number(formData.get("MeetingID"));
  
  // Security: If Staff, check assignment
  if (user.role?.toUpperCase() === "STAFF") {
    const isAssigned = await prisma.meetingmember.findFirst({
      where: { MeetingID: meetingID, StaffID: user.staffId }
    });
    if (!isAssigned) throw new Error("Unauthorized access to this meeting.");
  }

  const file = formData.get("DocumentFile") as File | null;
  const existingPath = formData.get("ExistingDocumentPath") as string;
  let documentPath = existingPath || "";

  if (file && file.size > 0) {
    if (file.size > MAX_FILE_SIZE) throw new Error("File size exceeds 5MB.");
    if (!ALLOWED_MIME_TYPES.includes(file.type)) throw new Error("Invalid format.");

    // Delete existing file
    if (existingPath) {
      try {
        const fileName = existingPath.split("/").pop();
        if (fileName) {
          await cloudinary.uploader.destroy(`meetflow/meetings/${fileName}`, { 
            resource_type: "raw" 
          });
        }
      } catch (err) {
        console.log("Old file delete failed:", err);
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uniqueId = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "meetflow/meetings",
          resource_type: "raw",
          public_id: uniqueId,
          access_mode: "public",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    documentPath = uploadResult.secure_url;
  }

  await prisma.meetings.update({
    where: { MeetingID: meetingID },
    data: {
      MeetingDate: new Date(formData.get("MeetingDate") as string),
      MeetingTypeID: Number(formData.get("MeetingTypeID")),
      MeetingDescription: (formData.get("MeetingDescription") as string) || "",
      VenueID: formData.get("VenueID") ? Number(formData.get("VenueID")) : null,
      DocumentPath: documentPath,
    },
  });

  revalidatePath("/meetings");
  revalidatePath(`/meetings/${meetingID}`);
  redirect("/meetings");
}
