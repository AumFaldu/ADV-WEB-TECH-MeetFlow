import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const draw = Number(searchParams.get("draw")) || 1;
  const start = Number(searchParams.get("start")) || 0;
  const length = Number(searchParams.get("length")) || 10;
  const searchValue = searchParams.get("search[value]")?.trim() || "";

  const orderColumnIndex = Number(searchParams.get("order[0][column]")) || 0;
  const orderDirection = (searchParams.get("order[0][dir]") as "asc" | "desc") || "desc";

  const columns = ["MeetingDate", "meetingtype.MeetingTypeName", "MeetingDescription", "IsCancelled"];
  const orderColumn = columns[orderColumnIndex] || "MeetingDate";

  // Build search condition without `mode` for nullable fields
  const whereCondition: Prisma.meetingsWhereInput = searchValue
    ? {
        OR: [
          { MeetingDescription: { contains: searchValue } },
          { meetingtype: { MeetingTypeName: { contains: searchValue } } },
        ],
      }
    : {};

  // Total records
  const totalRecords = await prisma.meetings.count();
  const recordsFiltered = await prisma.meetings.count({ where: whereCondition });

  // Fetch paginated records
  const meetings = await prisma.meetings.findMany({
    skip: start,
    take: length,
    where: whereCondition,
    orderBy:
      orderColumn === "meetingtype.MeetingTypeName"
        ? { meetingtype: { MeetingTypeName: orderDirection } }
        : { [orderColumn]: orderDirection },
    include: { meetingtype: true },
  });

  return NextResponse.json({
    draw,
    recordsTotal: totalRecords,
    recordsFiltered,
    data: meetings,
  });
}
