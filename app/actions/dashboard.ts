import { prisma } from "@/app/lib/prisma";
import { requireAuth } from "../lib/auth";

function roleFilter(user: any) {
  if (!user.staffId || user.role === "ADMIN") return {};
  return { meetingmembers: { some: { StaffID: user.staffId } } };
}

export async function getDashboardData() {
  const user = await requireAuth();
  const today = new Date();
  const filter = roleFilter(user);

  const [upcomingMeetings, completedMeetings, cancelledMeetings, pendingMOM, recentMOMs] =
    await prisma.$transaction([
      prisma.meetings.findMany({
        where: { ...filter, MeetingDate: { gte: today }, IsCancelled: false },
        include: { meetingtype: true, venue: true },
        orderBy: { MeetingDate: "asc" },
      }),
      prisma.meetings.count({
        where: { ...filter, MeetingDate: { lt: today }, IsCancelled: false },
      }),
      prisma.meetings.count({ where: { ...filter, IsCancelled: true } }),
      prisma.meetings.findMany({
        where: { ...filter, MeetingDate: { lt: today }, IsCancelled: false, OR: [{ DocumentPath: null }, { DocumentPath: "" }] },
        include: { meetingtype: true },
        orderBy: { MeetingDate: "desc" },
        take: 5,
      }),
      prisma.meetings.findMany({
        where: { ...filter, DocumentPath: { not: null } },
        include: { meetingtype: true },
        orderBy: { MeetingDate: "desc" },
        take: 5,
      }),
    ]);

  const pendingMOMCount = pendingMOM.length;

  return {
    upcomingMeetings,
    completedMeetings,
    cancelledMeetings,
    pendingMOM,
    pendingMOMCount,
    recentMOMs,
  };
}