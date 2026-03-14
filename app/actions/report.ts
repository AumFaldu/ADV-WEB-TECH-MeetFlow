"use server";

import { prisma } from "@/app/lib/prisma";
import { requireAuth, requirePermission } from "../lib/auth";

/* ---------- Meeting Summary ---------- */
export async function getMeetingSummary() {
  const user = await requireAuth();
  await requirePermission("VIEW_REPORT");

  const staffId = user.staffId;
  const role = user.role.toUpperCase();
  const now = new Date();

  const meetingFilter: any = role === "ADMIN" ? {} : { meetingmembers: { some: { StaffID: staffId } } };

  // Run all counts in a single transaction
  const [totalMeetings, cancelledMeetings, upcomingMeetings, completedMeetings, totalMembers, presentMembers] =
    await prisma.$transaction([
      prisma.meetings.count({ where: meetingFilter }),
      prisma.meetings.count({ where: { ...meetingFilter, IsCancelled: true } }),
      prisma.meetings.count({ where: { ...meetingFilter, MeetingDate: { gt: now }, IsCancelled: false } }),
      prisma.meetings.count({ where: { ...meetingFilter, MeetingDate: { lt: now }, IsCancelled: false } }),
      prisma.meetingmember.count({
        where:
          role === "ADMIN"
            ? {}
            : {
                meetings: { meetingmembers: { some: { StaffID: staffId! } } },
              },
      }),
      prisma.meetingmember.count({
        where:
          role === "ADMIN"
            ? { IsPresent: true }
            : {
                IsPresent: true,
                meetings: { meetingmembers: { some: { StaffID: staffId! } } },
              },
      }),
    ]);

  const attendancePercentage = totalMembers === 0 ? 0 : Number(((presentMembers / totalMembers) * 100).toFixed(2));

  return { totalMeetings, cancelledMeetings, upcomingMeetings, completedMeetings, attendancePercentage };
}

/* ---------- Meeting Wise Report ---------- */
export async function getMeetingWiseReport() {
  const user = await requireAuth();
  await requirePermission("EXPORT_REPORT");

  const staffId = user.staffId;
  const role = user.role.toUpperCase();

  const meetingFilter: any = role === "ADMIN" ? {} : { meetingmembers: { some: { StaffID: staffId } } };

  const meetingsData = await prisma.meetings.findMany({
    where: meetingFilter,
    include: {
      meetingtype: true,
      meetingmembers: true,
      venue: true,
    },
    orderBy: { MeetingDate: "desc" },
  });

  return meetingsData.map((meeting) => {
    const totalMembers = meeting.meetingmembers.length;
    const presentMembers = meeting.meetingmembers.filter((m) => m.IsPresent).length;
    const absentMembers = totalMembers - presentMembers;
    const attendancePercentage = totalMembers === 0 ? 0 : Number(((presentMembers / totalMembers) * 100).toFixed(2));

    return {
      MeetingID: meeting.MeetingID,
      MeetingDate: meeting.MeetingDate,
      MeetingType: meeting.meetingtype.MeetingTypeName,
      Venue: meeting.venue?.VenueName ?? "N/A",
      IsCancelled: meeting.IsCancelled,
      totalMembers,
      presentMembers,
      absentMembers,
      attendancePercentage,
    };
  });
}