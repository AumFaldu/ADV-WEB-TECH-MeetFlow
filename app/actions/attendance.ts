"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth, requirePermission } from "../lib/auth";

export async function saveAttendance(formData: FormData) {
  const user = await requireAuth();
  await requirePermission("MARK_ATTENDANCE");

  const meetingID = Number(formData.get("meetingID"));
  const convenerId = user.staffId; // undefined for admin

  let members = await prisma.meetingmember.findMany({
    where: { MeetingID: meetingID },
    select: { MeetingMemberID: true, StaffID: true },
  });

  if (convenerId) {
    members = members.filter((m) => m.StaffID !== convenerId);
  }

  await prisma.$transaction(
    members.map((member) => {
      const present = formData.get(`present_${member.MeetingMemberID}`) === "on";
      const remarks = String(formData.get(`remarks_${member.MeetingMemberID}`) || "");
      return prisma.meetingmember.update({
        where: { MeetingMemberID: member.MeetingMemberID },
        data: { IsPresent: present, Remarks: remarks },
      });
    })
  );

  revalidatePath(`/meetings/attendance/${meetingID}`);
  revalidatePath(`/meetings/summary/${meetingID}`);
  redirect("/meetings");
}