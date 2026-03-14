"use server";

import { prisma } from "@/app/lib/prisma";
import { requirePermission } from "../lib/auth";

export async function getDepartments() {
  await requirePermission("VIEW_DEPARTMENT")
  const data = await prisma.department.findMany({
    orderBy: { DepartmentID: "desc" },
  });

  return data.map((d) => ({
    id: d.DepartmentID,
    name: d.DepartmentName,
    remarks: d.Remarks,
  }));
}

export async function addDepartment(formData: FormData) {
  await requirePermission("ADD_DEPARTMENT");
  const name = formData.get("name") as string;
  const remarks = formData.get("remarks") as string;

  const dept = await prisma.department.create({
    data: {
      DepartmentName: name,
      Remarks: remarks,
    },
  });

  return {
    id: dept.DepartmentID,
    name: dept.DepartmentName,
    remarks: dept.Remarks,
  };
}

export async function deleteDepartment(id: number) {
  await requirePermission("DELETE_DEPARTMENT")
  await prisma.department.delete({
    where: { DepartmentID: id },
  });
}
export async function updateDepartment(id: number, formData: FormData) {
  await requirePermission("EDIT_DEPARTMENT")
  return prisma.department.update({
    where: { DepartmentID: id },
    data: {
      DepartmentName: formData.get("name") as string,
      Remarks: formData.get("remarks") as string,
    },
  });
}
