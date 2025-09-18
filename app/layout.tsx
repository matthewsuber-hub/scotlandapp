import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Over the Hill in the Highlands',
  description: 'Birkhill Castle | 4–9 Jan 2026',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
