"use server";

import { requirePermission } from "../lib/auth";
import { prisma } from "../lib/prisma";

// Add new meeting type
export async function addMeetingType(formData: FormData) {
  await requirePermission("ADD_MEETING_TYPE")
  const name = formData.get("name") as string;
  const remarks = formData.get("remarks") as string;

  if (!name) throw new Error("Meeting type name is required");

  const meetingType = await prisma.meetingtype.create({
    data: {
      MeetingTypeName: name,
      Remarks: remarks || null,
    },
  });

  return {
    id: meetingType.MeetingTypeID,
    name: meetingType.MeetingTypeName,
    remarks: meetingType.Remarks,
  };
}

// Update existing meeting type
export async function updateMeetingType(id: number, formData: FormData) {
  await requirePermission("EDIT_MEETING_TYPE")
  const name = formData.get("name") as string;
  const remarks = formData.get("remarks") as string;

  await prisma.meetingtype.update({
    where: { MeetingTypeID: id },
    data: {
      MeetingTypeName: name,
      Remarks: remarks || null,
    },
  });
}

// Delete meeting type
export async function deleteMeetingType(id: number) {
  await requirePermission("DELETE_MEETING_TYPE")
  await prisma.meetingtype.delete({
    where: { MeetingTypeID: id },
  });
}

// Fetch all meeting types
export async function getMeetingTypes() {
  await requirePermission("VIEW_MEETING_TYPE")
  const data = await prisma.meetingtype.findMany({
    orderBy: { MeetingTypeName: "asc" },
  });

  return data.map((x) => ({
    id: x.MeetingTypeID,
    name: x.MeetingTypeName,
    remarks: x.Remarks,
  }));
}