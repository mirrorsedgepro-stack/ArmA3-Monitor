export interface OperationPhase {
  time: string;
  title: string;
  description: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface TacticalEvent {
  id: string;
  codeName: string;
  title: string;
  subtitle: string;
  startTime: string; // ISO 8601 with timezone e.g. "2026-10-05T19:30:00+11:00"
  durationHours: number;
  theater: string;
  missionName: string;
  host: string;
  slotsMax: number;
  initialAttendees: number;
  briefing: string;
  rules: string[];
  phases: OperationPhase[];
  commsChannel: string;
  serverIp: string;
  serverPort: number;
}

export const TONIGHT_EVENT: TacticalEvent = {
  id: 'op-antistasi-01',
  codeName: 'LABOUR DAY',
  title: 'Labour Day Event',
  subtitle: 'Server is online 24/7 • Community session tonight @ 7:30 PM AEDT',
  startTime: '2026-10-05T19:30:00+11:00', // Tonight at 7:30 PM AEDT (Sydney Local Time)
  durationHours: 3.5,
  theater: 'Altis',
  missionName: 'Antistasi Ultimate - Altis',
  host: 'Frenchy',
  slotsMax: 32,
  initialAttendees: 14,
  briefing: "The server runs 24/7 with persistent campaign progression—you can hop in and play anytime! Tonight at 7:30 PM AEDT, everyone is jumping on together for our Labour Day session to run missions, capture outposts, and push the Antistasi campaign forward.",
  rules: [],
  phases: [
    {
      time: '19:30 - 20:00 AEDT',
      title: 'Hop On & Gear Up',
      description: 'Join the server, grab your gear from the arsenal, and group up at HQ.',
      status: 'upcoming'
    },
    {
      time: '20:00 - 21:15 AEDT',
      title: 'Main Attacks & Base Capture',
      description: 'Head out together to capture enemy outposts and take down the radar station.',
      status: 'upcoming'
    },
    {
      time: '21:15 - 22:30 AEDT',
      title: 'Loot & Logistics',
      description: 'Hijack enemy supply trucks, bring ammo and vehicles back to HQ, and save progress.',
      status: 'upcoming'
    }
  ],
  commsChannel: 'Discord / In-Game Voice',
  serverIp: '180.181.238.103',
  serverPort: 2302,
};
