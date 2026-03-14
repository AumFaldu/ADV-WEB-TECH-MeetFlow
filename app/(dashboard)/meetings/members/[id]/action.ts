"use server";

import { requireAuth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

export async function saveMembers(
  meetingID: number,
  formData: FormData
) {
  const user = await requireAuth();
  const convenerId = user.staffId;

  // Get checked staff IDs
  const selected = formData.getAll("staff") as string[];
  const staffIDs = selected.map((id) => Number(id));

  // Remove old members
  // Exclude convener from deletion only if convenerId exists
  const deleteWhere: any = { MeetingID: meetingID };
  if (convenerId) {
    deleteWhere.StaffID = { not: convenerId };
  }

  await prisma.meetingmember.deleteMany({
    where: deleteWhere,
  });

  // Insert only checked members
  if (staffIDs.length > 0) {
    await prisma.meetingmember.createMany({
      data: staffIDs.map((staffID) => ({
        MeetingID: meetingID,
        StaffID: staffID,
        IsPresent: false,
      })),
    });
  }

  redirect("/meetings");
}