import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Frenchy's Antistasi Ultimate | Arma 3 Dedicated Server Operations",
  description: "Live server telemetry, active operator roster, and complete Steam Workshop modpack synchronization for Arma 3.",
  keywords: ['Arma 3', 'Antistasi Ultimate', 'RHS', 'Server Stats', 'Mods', 'Steam Workshop', 'Preset', 'A2S Query'],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
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
      <body className="text-arma-text min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
