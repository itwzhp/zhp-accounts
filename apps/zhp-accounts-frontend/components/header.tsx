'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Home, List, User } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const navigationRoutes = [
  { label: 'Strona główna', href: '/', icon: <Home className="h-4 w-4" /> },
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
      <div className="container mx-auto flex items-center justify-between py-4">
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
      </div>
    </header>
  );
}
