import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { cn } from '@/lib/utils';
import Providers from '@/app/providers';
import { Suspense } from 'react';
import Header from '@/components/header';

const museo = localFont({
  variable: '--font-museo',
  src: '../fonts/Museo300-Regular.woff2',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aktywacja | Microsoft365 w ZHP',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={cn(museo.className, 'antialiased')}>
        <Header />

        <main className="px-4">
          <Providers>
            <Suspense fallback={<div>...loading</div>}>{children}</Suspense>
          </Providers>
        </main>
      </body>
    </html>
  );
}
