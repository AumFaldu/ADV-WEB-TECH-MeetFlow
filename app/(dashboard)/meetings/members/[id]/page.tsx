"use server";

import { prisma } from "@/app/lib/prisma";
import MembersForm from "./MembersForm";
import { requireAuth } from "@/app/lib/auth";

export default async function MembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meetingID = Number(id);

  const user = await requireAuth();
  const convenerId = user.staffId; // undefined for admin

  // Convener sees all staff except themselves, admin sees all
  const staffWhere = convenerId
    ? { StaffID: { not: convenerId } }
    : {};

  const staff = await prisma.staff.findMany({
    where: staffWhere,
    orderBy: { StaffName: "asc" },
  });

  // Fetch existing members
  const existingMembers = await prisma.meetingmember.findMany({
    where: { MeetingID: meetingID },
    select: { StaffID: true },
  });

  let existingStaffIDs = existingMembers.map((m) => m.StaffID);

  // ✅ If admin, also include the convener in existingStaffIDs
  if (!convenerId) {
    // Fetch convener of this meeting
    const convenerMember = await prisma.meetingmember.findFirst({
      where: { MeetingID: meetingID, IsPresent: true }, // or based on your convener logic
      select: { StaffID: true },
    });
    if (convenerMember) {
      existingStaffIDs.push(convenerMember.StaffID);
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Members to Meeting</h1>

      <MembersForm
        meetingID={meetingID}
        staff={staff}
        existingStaffIDs={existingStaffIDs}
      />
    </div>
  );
}