import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Image from 'next/image';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import Providers from '@/app/providers';
import { Suspense } from 'react';

const museo = localFont({
  variable: '--font-museo',
  src: '../fonts/Museo300-Regular.woff2',
  display: 'swap',
});

const navigationRoutes = [{ label: 'Jednostki', href: '/units' }];

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
        <header className={cn('bg-primary text-primary-foreground')}>
          <div
            className={cn(
              'container mx-auto flex items-center justify-between py-4',
            )}
          >
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/images/identifier-zhp-white.png"
                height={45}
                width={100}
                alt="Związek Harcerstwa Polskiego"
              />
              <span className="text-lg font-extrabold tracking-wide">
                aktywacja.zhp.pl
              </span>
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                {navigationRoutes.map((route) => (
                  <NavigationMenuItem key={route.href}>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'bg-transparent font-black',
                      )}
                    >
                      <Link href={route.href}>{route.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </header>

        <main>
          <Providers>
            <Suspense fallback={<div>...loading</div>}>{children}</Suspense>
          </Providers>
        </main>
      </body>
    </html>
  );
}
