import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Creator OS - Multi-Platform Content Management',
  description: 'Manage and publish your content to Snapchat and Instagram with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
