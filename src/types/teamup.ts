export interface TeamUpEvent {
  id: string;
  title: string;
  start_dt: string;
  end_dt: string;
  who: string;
  notes: string | null;
  subcalendar_id: number;
  subcalendar_ids: number[];
  all_day: boolean;
  rrule: string | null;
  location: string | null;
  custom?: Record<string, unknown>;
}

export interface TeamUpEventsResponse {
  events: TeamUpEvent[];
  timestamp: number;
}

export interface SubCalendar {
  id: number;
  name: string;
  active: boolean;
  color: number;
}

export interface TeamUpSubCalendarsResponse {
  subcalendars: SubCalendar[];
}

export interface ScheduleEvent {
  id: string;
  time: string;
  endTime: string;
  title: string;
  instructor: string;
  type: "class" | "session" | "event" | "reserved";
}
