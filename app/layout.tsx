import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Creator OS - Content Management Platform',
  description: 'Manage and publish your content to Snapchat with ease',
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
