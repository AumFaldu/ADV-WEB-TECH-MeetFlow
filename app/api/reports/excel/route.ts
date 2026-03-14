import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getMeetingSummary, getMeetingWiseReport } from "@/app/actions/report";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  if (!type || !["summary", "meetingwise"].includes(type)) {
    return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
  }

  let data: any[] = [];
  let filename = "report.xlsx";

  if (type === "summary") {
    const summary = await getMeetingSummary();
    data = [
      ["Metric", "Value"],
      ["Total Meetings", summary.totalMeetings],
      ["Upcoming Meetings", summary.upcomingMeetings],
      ["Completed Meetings", summary.completedMeetings],
      ["Cancelled Meetings", summary.cancelledMeetings],
      ["Attendance %", `${summary.attendancePercentage}%`],
    ];
    filename = "MeetingSummary.xlsx";
  } else {
    const meetings = await getMeetingWiseReport();
    data = [
      ["Date", "Type", "Venue", "Total", "Present", "Absent", "Attendance %", "Status"],
      ...meetings.map((m) => [
        new Date(m.MeetingDate).toLocaleDateString(),
        m.MeetingType,
        m.Venue || "N/A",
        m.totalMembers,
        m.presentMembers,
        m.absentMembers,
        m.attendancePercentage,
        m.IsCancelled ? "Cancelled" : "Active",
      ]),
    ];
    filename = "MeetingWise.xlsx";
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, type === "summary" ? "Summary" : "MeetingWise");

  const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(excelBuffer, {
    headers: {
      "Content-Disposition": `attachment; filename=${filename}`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}