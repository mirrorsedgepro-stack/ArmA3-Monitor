import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arma 3 Server Portal | Live Stats & Mod Repository',
  description: 'Real-time telemetry, active player roster, and complete Steam Workshop modpack synchronization for Arma 3 server operations.',
  keywords: ['Arma 3', 'Server Stats', 'Mods', 'Steam Workshop', 'Preset', 'A2S Query', 'MilSim'],
  authors: [{ name: 'Arma 3 Tactical Ops' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090a0f] text-zinc-200 min-h-screen flex flex-col antialiased selection:bg-zinc-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
