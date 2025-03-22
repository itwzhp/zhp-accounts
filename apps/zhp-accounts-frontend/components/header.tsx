'use client';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { List, Menu, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const navigationRoutes = [
  {
    label: 'Lista jednostek',
    href: '/units',
    icon: <List className="h-4 w-4" />,
  },
];

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="border-b bg-primary text-primary-foreground">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image
              src="/images/identifier-zhp-white.png"
              height={45}
              width={100}
              alt="Związek Harcerstwa Polskiego"
            />
            <span className="text-lg font-extrabold tracking-wide">
              aktywacja.zhp.pl
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList>
            {isLoggedIn &&
              navigationRoutes.map((route) => (
                <NavigationMenuItem key={route.href}>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'bg-transparent font-black',
                    )}
                  >
                    <Link href={route.href} className="flex items-center gap-1">
                      {route.icon}
                      {route.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}

            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  'flex cursor-pointer items-center gap-1 bg-transparent font-black',
                )}
                onClick={() => setIsLoggedIn(!isLoggedIn)}
              >
                <User className="h-4 w-4" />
                <span>{isLoggedIn ? 'Wyloguj' : 'Zaloguj'}</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile navigation */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="hidden">Navigation</SheetTitle>
            </SheetHeader>

            <ul className="flex flex-col gap-1">
              {isLoggedIn &&
                navigationRoutes.map((route) => (
                  <li key={route.href}>
                    <Link
                      href={route.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'flex w-full items-center justify-start gap-1 bg-transparent font-black',
                      )}
                    >
                      {route.icon}
                      {route.label}
                    </Link>
                  </li>
                ))}

              <li>
                <button
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'flex w-full items-center justify-start gap-1 bg-transparent font-black',
                  )}
                  onClick={() => setIsLoggedIn(!isLoggedIn)}
                >
                  <User className="h-4 w-4" />
                  <span>{isLoggedIn ? 'Wyloguj' : 'Zaloguj'}</span>
                </button>
              </li>
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
