import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BREE — BRUTAL RAW EQUIPMENT',
  description: 'BREE = BRUTAL RAW EQUIPMENT. Hand finished in Osaka. Edition of 240.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Anton&family=Archivo:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
