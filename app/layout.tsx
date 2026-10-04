import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Frenchy's Antistasi Ultimate | Arma 3 Server Intelligence & Mods",
  description: "Live server telemetry, connected player roster, and complete Steam Workshop modpack synchronization for Arma 3.",
  keywords: ['Arma 3', 'Antistasi Ultimate', 'RHS', 'Server Stats', 'Mods', 'Steam Workshop', 'Preset', 'A2S Query'],
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
      <body className="bg-[#0B0D17] text-white min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
