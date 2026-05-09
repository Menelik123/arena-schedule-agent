import { NextRequest, NextResponse } from "next/server";
import { buildSchedule, getTodayEST } from "@/lib/teamup";
import { generateSchedulePDF } from "@/lib/pdf";
import { sendScheduleEmail } from "@/lib/email";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  // Protect from unauthorized calls (Vercel Cron sets this automatically)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const date = getTodayEST();
    const events = await buildSchedule(date);

    const pdfBuffer = await generateSchedulePDF(events, date);

    const host = req.headers.get("host") ?? "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const scheduleUrl = `${protocol}://${host}/schedule/${date}`;

    await sendScheduleEmail(pdfBuffer, date, scheduleUrl);

    return NextResponse.json({
      success: true,
      date,
      eventsFound: events.length,
    });
  } catch (err) {
    console.error("Schedule generation failed:", err);
    return NextResponse.json({ error: "Failed to generate schedule" }, { status: 500 });
  }
}
