import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Frenchy's A3Wasteland | CUP Chernarus Redux Arma 3 Server",
  description: "Live status, map, kill feed and Steam Workshop mod preset for Frenchy's 64-player A3Wasteland server on CUP Chernarus Redux.",
  keywords: ['Arma 3', 'A3Wasteland', 'Wasteland', 'Chernarus Redux', 'CUP', 'Server Stats', 'Mods', 'Steam Workshop', 'Preset', 'A2S Query'],
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
