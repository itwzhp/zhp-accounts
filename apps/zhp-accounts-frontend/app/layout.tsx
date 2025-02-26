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

const museo = localFont({
  variable: '--font-museo',
  src: '../fonts/Museo300-Regular.woff2',
  display: 'swap',
});

const navigationRoutes = [
  { label: 'Aktywacja', href: '/accounts/activate' },
  { label: 'Resetuj hasło', href: '/' },
];

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
      <body className={cn(museo.variable, 'antialiased')}>
        <header className={cn('bg-primary text-primary-foreground')}>
          <div
            className={cn(
              'container mx-auto flex items-center justify-between py-4',
            )}
          >
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/identifier-zhp-white.png"
                height={45}
                width={100}
                alt="Związek Harcerstwa Polskiego"
              />
              <span>aktywacja.zhp.pl</span>
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                {navigationRoutes.map((route) => (
                  <NavigationMenuItem key={route.href}>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'bg-transparent',
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

        <main>{children}</main>
      </body>
    </html>
  );
}
