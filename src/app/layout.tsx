import type { Metadata } from 'next';

import '../styles/theme.css'; // Theme variables - must be imported FIRST
import '../styles/cursor.css'; // Cursor accessibility system - after theme.css
import '../styles/adaptive.css'; // Adaptive desktop system - after theme.css and cursor.css

import './globals.css'; // Must be here
import './keyboard-navigation.css'; // Keyboard navigation styles

import { furore } from '@/fonts'; // For global font variable
import { ClientLayoutWrapper } from '@/components/layout/ClientLayoutWrapper';
import { cn } from '@/lib/utils';
import { RegionProvider } from '@/contexts/RegionContext';
import { ResponsiveProvider } from '@/contexts/ResponsiveContext';

export const metadata: Metadata = {
  title: 'Профессиональная Сборка Мебели | SHELF',
  description:
    'Качественная и быстрая сборка мебели в вашем городе. Шкафы, кухни, кровати и многое другое. Сайт-визитка.',
  other: {
    'theme-color': '#000000',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={cn(furore.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className="bg-background text-foreground overflow-x-hidden">
        <ResponsiveProvider>
          <RegionProvider>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </RegionProvider>
        </ResponsiveProvider>
      </body>
    </html>
  );
}
