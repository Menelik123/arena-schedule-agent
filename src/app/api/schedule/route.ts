import { NextRequest, NextResponse } from "next/server";
import { buildSchedule, getTodayEST } from "@/lib/teamup";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? getTodayEST();

  try {
    const events = await buildSchedule(date);
    return NextResponse.json({ events, date });
  } catch (err) {
    console.error("Failed to fetch schedule:", err);
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 });
  }
}
