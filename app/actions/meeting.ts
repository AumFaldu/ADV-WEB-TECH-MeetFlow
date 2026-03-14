"use server";

import { prisma } from "@/app/lib/prisma";
import { requireAuth, requirePermission } from "../lib/auth";
import { Prisma } from "@prisma/client";
export type MeetingWithType = Prisma.meetingsGetPayload<{
  include: { meetingtype?: true };
}>;
function roleFilter(user: any) {
  if (!user.staffId || user.role === "ADMIN") return {};
  return { meetingmembers: { some: { StaffID: user.staffId } } };
}
export async function getMeetings(): Promise<MeetingWithType[]> {
  const user = await requireAuth();
  await requirePermission("VIEW_MEETING");

  return prisma.meetings.findMany({
    where: roleFilter(user),
    include: { meetingtype: true },
    orderBy: { MeetingDate: "desc" },
  });
}

export async function getMeetingSummary(meetingID: number) {
  const user = await requirePermission("VIEW_MEETING");

  const meeting = await prisma.meetings.findUnique({
    where: { MeetingID: meetingID },
  });

  if (!meeting) return null;

  const isCompleted =
    !meeting.IsCancelled && new Date(meeting.MeetingDate) < new Date();
  if (!isCompleted) return null;

  const members = await prisma.meetingmember.findMany({
    where: { MeetingID: meetingID },
    include: { staff: true },
  });

  return { members };
}