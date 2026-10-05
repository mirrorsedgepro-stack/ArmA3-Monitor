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
  codeName: 'OP: GUERRILLA DAWN',
  title: "Frenchy's Antistasi: Squad Campaign Joint Strike",
  subtitle: "32-Player Cooperative Guerrilla Warfare & Logistics Seizure",
  startTime: '2026-10-05T19:30:00+11:00', // Tonight at 7:30 PM AEDT (Sydney Local Time)
  durationHours: 3.5,
  theater: 'Altis (Mediterranean Theater)',
  missionName: 'Antistasi Ultimate - Altis (RHS Escalation)',
  host: 'Frenchy [Commander]',
  slotsMax: 32,
  initialAttendees: 14,
  briefing: "Rebel forces will assemble at Rebel HQ on Altis. Primary tactical objectives: mobilize fireteams, complete Arsenal gear staging, synchronize radio frequencies, and launch coordinated assaults on enemy munitions depots and radar installations across western Altis.",
  rules: [
    "Coordinate with squad lead on TFAR/in-game VOIP prior to weapons discharge.",
    "Positive identification on all targets; civilian casualties reduce town support.",
    "ACE medical procedures enforced - ensure 2x Tourniquets and bandages equipped.",
    "Capture enemy supply crates and logistics trucks back to HQ for permanent garrison arming."
  ],
  phases: [
    {
      time: '19:30 - 20:00 AEDT',
      title: 'Phase I: Staging, Loadout & Briefing',
      description: 'Check-in at Rebel HQ, ACE medical prep, gear calibration via Arsenal, TFAR radio frequency assignments.',
      status: 'upcoming'
    },
    {
      time: '20:00 - 21:15 AEDT',
      title: 'Phase II: Radar Outpost Recon & Sabotage',
      description: 'Low-profile motorized insertion, elimination of enemy air-search radar, suppression of QRF patrols.',
      status: 'upcoming'
    },
    {
      time: '21:15 - 22:30 AEDT',
      title: 'Phase III: Logistics Convoy Seizure & Exfil',
      description: 'Ambush and hijack enemy munitions transport, heavy vehicle recovery, convoy escort back to FOB.',
      status: 'upcoming'
    }
  ],
  commsChannel: 'Task Force Arrowhead Radio (TFAR) & Server Discord',
  serverIp: '180.181.238.103',
  serverPort: 2302,
};
