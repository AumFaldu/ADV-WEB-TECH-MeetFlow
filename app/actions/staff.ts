"use server";

import { requirePermission } from "../lib/auth";
import { prisma } from "../lib/prisma";

export async function addStaff(formData: FormData) {
  await requirePermission("MANAGE_STAFF")
  const name = formData.get("name") as string;
  const MobileNo = formData.get("mobile") as string;

  if (!name) throw new Error("Staff name is required");

  const staff = await prisma.staff.create({
    data: {
      StaffName: name,
      MobileNo: MobileNo || null,
    },
  });

  return {
    id: staff.StaffID,
    name: staff.StaffName,
    MobileNo: staff.MobileNo,
  };
}

// Update existing meeting type
export async function updateStaff(id: number, formData: FormData) {
  await requirePermission("MANAGE_STAFF")
  const name = formData.get("name") as string;
  const MobileNo = formData.get("mobileNo") as string;
  const DepartmentID = formData.get("departmentId") as string;

  await prisma.staff.update({
    where: { StaffID: id },
    data: {
      StaffName: name,
      MobileNo: MobileNo || null,
      DepartmentID: DepartmentID ? Number(DepartmentID) : null,
    },
  });
}

// Delete meeting type
export async function deleteStaff(id: number) {
  await requirePermission("MANAGE_STAFF")
  await prisma.$transaction([
    prisma.meetingmember.deleteMany({ where: { StaffID: id } }),
    prisma.users.updateMany({ where: { StaffID: id }, data: { IsActive: false, StaffID: null } }),
    prisma.staff.delete({ where: { StaffID: id } }),
  ]);
}

// Fetch all meeting types
export async function getStaff() {
  await requirePermission("VIEW_STAFF")
  const data = await prisma.staff.findMany({
    include:{
      department:true,
      users:true,
    },
    orderBy: { StaffName: "asc" },
  });

  return data.map((x) => ({
    id: x.StaffID,
    name: x.StaffName,
    MobileNo: x.MobileNo,
    email:x.EmailAddress,
    departmentId:x.DepartmentID,
    departmentName:x.department?.DepartmentName || "Not Assigned",
    role: x.users?.[0]?.Role || "No Login",
  }));
}