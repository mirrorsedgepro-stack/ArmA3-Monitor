import { TacticalEvent } from '@/data/defaultEvents';

/**
 * Formats a Date object to iCalendar UTC timestamp format (YYYYMMDDTHHMMSSZ)
 */
function toIcsUtcDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Generates an iCalendar (.ics) string for the tactical event
 */
export function generateEventIcs(event: TacticalEvent): string {
  const startDate = new Date(event.startTime);
  const endDate = new Date(startDate.getTime() + event.durationHours * 60 * 60 * 1000);
  const now = new Date();

  const uid = `${event.id}-${startDate.getTime()}@arma3-monitor.com`;
  const location = `Frenchy's Antistasi Dedicated (Direct Connect: ${event.serverIp}:${event.serverPort})`;
  const description = `${event.title}\\n\\nCode: ${event.codeName}\\nTheater: ${event.theater}\\nHost: ${event.host}\\nComms: ${event.commsChannel}\\n\\nBriefing: ${event.briefing}\\n\\nDirect Connect IP: ${event.serverIp}:${event.serverPort}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Frenchy Antistasi//Tactical Event Tracker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toIcsUtcDate(now)}`,
    `DTSTART:${toIcsUtcDate(startDate)}`,
    `DTEND:${toIcsUtcDate(endDate)}`,
    `SUMMARY:[ARMA 3] ${event.codeName} - ${event.title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'CLASS:PUBLIC',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Arma 3 Operation Starting in 30 minutes! Mobilize gear.',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Generates a Google Calendar web link for instant 1-click addition
 */
export function generateGoogleCalendarUrl(event: TacticalEvent): string {
  const startDate = new Date(event.startTime);
  const endDate = new Date(startDate.getTime() + event.durationHours * 60 * 60 * 1000);

  const startUtc = toIcsUtcDate(startDate);
  const endUtc = toIcsUtcDate(endDate);

  const title = `[ARMA 3] ${event.codeName} - ${event.title}`;
  const details = `${event.briefing}\n\nServer Direct Connect: ${event.serverIp}:${event.serverPort}\nComms: ${event.commsChannel}\nHost: ${event.host}`;
  const location = `${event.serverIp}:${event.serverPort} (Arma 3 Dedicated)`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startUtc}/${endUtc}`,
    details: details,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
