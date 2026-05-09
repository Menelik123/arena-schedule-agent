import type { TeamUpEventsResponse, TeamUpSubCalendarsResponse, ScheduleEvent, SubCalendar } from "@/types/teamup";

const BASE_URL = "https://api.teamup.com";
const CALENDAR_KEY = process.env.TEAMUP_CALENDAR_KEY!;
const API_TOKEN = process.env.TEAMUP_API_TOKEN!;

const headers = {
  "Teamup-Token": API_TOKEN,
  "Content-Type": "application/json",
};

export async function getSubCalendars(): Promise<SubCalendar[]> {
  const res = await fetch(`${BASE_URL}/${CALENDAR_KEY}/subcalendars`, { headers });
  if (!res.ok) throw new Error(`TeamUp subcalendars error: ${res.status}`);
  const data: TeamUpSubCalendarsResponse = await res.json();
  return data.subcalendars;
}

export async function getEventsForDate(date: string): Promise<TeamUpEventsResponse> {
  const url = `${BASE_URL}/${CALENDAR_KEY}/events?startDate=${date}&endDate=${date}`;
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) throw new Error(`TeamUp events error: ${res.status}`);
  return res.json();
}

function formatTime(dt: string): string {
  const date = new Date(dt);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  });
}

// Sub-calendar names that map to "reserved" (courts, facilities, etc.)
// Update these names to match your actual TeamUp sub-calendar names
const RESERVED_CALENDAR_NAMES = ["court", "courts", "facility", "facilities", "field"];

export async function buildSchedule(date: string): Promise<ScheduleEvent[]> {
  const [eventsData, subCalendars] = await Promise.all([
    getEventsForDate(date),
    getSubCalendars(),
  ]);

  const subCalendarMap = new Map(subCalendars.map((s) => [s.id, s.name.toLowerCase()]));

  const schedule: ScheduleEvent[] = eventsData.events.map((event) => {
    const calendarName = subCalendarMap.get(event.subcalendar_ids[0]) ?? "";
    const isReserved = RESERVED_CALENDAR_NAMES.some((name) => calendarName.includes(name));

    return {
      id: event.id,
      time: formatTime(event.start_dt),
      endTime: formatTime(event.end_dt),
      title: isReserved ? "Reserved" : event.title,
      instructor: isReserved ? "" : (event.who ?? ""),
      type: isReserved ? "reserved" : "class",
    };
  });

  // Sort by start time
  return schedule.sort((a, b) => {
    const aTime = new Date(eventsData.events.find((e) => e.id === a.id)!.start_dt);
    const bTime = new Date(eventsData.events.find((e) => e.id === b.id)!.start_dt);
    return aTime.getTime() - bTime.getTime();
  });
}

export function getTodayEST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}
