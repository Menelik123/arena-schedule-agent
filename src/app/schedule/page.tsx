import { buildSchedule, getTodayEST } from "@/lib/teamup";
import type { ScheduleEvent } from "@/types/teamup";

export const dynamic = "force-dynamic";

function formatDisplayDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function EventRow({ event, index }: { event: ScheduleEvent; index: number }) {
  const isReserved = event.type === "reserved";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "14px 20px",
        background: isReserved ? "#f7f7f7" : index % 2 === 0 ? "#ffffff" : "#fafafa",
        borderBottom: "1px solid #efefef",
        opacity: isReserved ? 0.6 : 1,
      }}
    >
      <div style={{ width: "26%", fontSize: 14, fontWeight: 700, color: isReserved ? "#bbb" : "#0d0d0d" }}>
        {event.time}
      </div>
      <div style={{ width: "44%", fontSize: 14, color: isReserved ? "#aaa" : "#1a1a1a", fontStyle: isReserved ? "italic" : "normal" }}>
        {event.title}
      </div>
      <div style={{ width: "30%", fontSize: 13, color: "#666" }}>
        {event.instructor}
      </div>
    </div>
  );
}

export default async function SchedulePage() {
  const date = getTodayEST();
  let events: ScheduleEvent[] = [];
  let error = false;

  try {
    events = await buildSchedule(date);
  } catch {
    error = true;
  }

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Daily Schedule — The Arena Lilburn</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f3; }
        `}</style>
      </head>
      <body>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 0 40px" }}>
          {/* Header */}
          <div style={{ background: "#0d0d0d", padding: "24px 20px", borderRadius: "6px 6px 0 0" }}>
            <div style={{ color: "#ffffff", fontSize: 20, fontWeight: 700 }}>The Arena Lilburn</div>
            <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>{formatDisplayDate(date)}</div>
          </div>

          {/* Column headers */}
          <div style={{ display: "flex", background: "#1a1a1a", padding: "8px 20px" }}>
            <div style={{ width: "26%", fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1 }}>Time</div>
            <div style={{ width: "44%", fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1 }}>Class / Session</div>
            <div style={{ width: "30%", fontSize: 10, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1 }}>Instructor</div>
          </div>

          {/* Rows */}
          <div style={{ background: "#fff", borderRadius: "0 0 6px 6px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {error ? (
              <div style={{ padding: 40, textAlign: "center", color: "#aaa", fontSize: 14 }}>
                Unable to load schedule. Please try again shortly.
              </div>
            ) : events.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#aaa", fontSize: 14 }}>
                No events scheduled for today.
              </div>
            ) : (
              events.map((event, i) => <EventRow key={event.id} event={event} index={i} />)
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#bbb" }}>
            Powered by Apex Digital
          </div>
        </div>
      </body>
    </html>
  );
}
