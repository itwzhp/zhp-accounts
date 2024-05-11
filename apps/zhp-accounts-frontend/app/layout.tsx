import localFont from 'next/font/local';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import clsx from 'clsx';

const inter = Inter({ subsets: ['latin'] });
const museo = localFont({
  src: '../fonts/Museo300-Regular.woff2',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aktywacja | Microsoft365 w ZHP',
};

const navigationRoutes = [
  { label: 'Aktywacja', href: '/accounts/create' },
  { label: 'Resetuj hasło', href: '/' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={clsx(museo.className, inter.className, 'drawer')}>
        <input
          id="navigation-drawer"
          type="checkbox"
          className="drawer-toggle"
        />

        <div className="drawer-content flex flex-col">
          <Navbar navigationRoutes={navigationRoutes} />

          {children}
        </div>

        <div className="drawer-side">
          <label
            htmlFor="navigation-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu min-h-full w-80 bg-base-200 p-4">
            {navigationRoutes.map((route) => (
              <li key={route.label}>
                <Link href={route.href}>{route.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </body>
    </html>
  );
}

function Navbar({
  navigationRoutes,
}: {
  navigationRoutes: { label: string; href: string }[];
}) {
  return (
    <div className="navbar w-full bg-primary text-primary-content">
      <div className="mx-2 flex-1 px-2">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/identifier-zhp-white.png"
            height={45}
            width={100}
            alt="Związek Harcerstwa Polskiego"
          />
          <span>aktywacja.zhp.pl</span>
        </Link>
      </div>

      <div className="flex-none lg:hidden">
        <label
          htmlFor="navigation-drawer"
          aria-label="open sidebar"
          className="btn btn-square btn-ghost"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </label>
      </div>

      <div className="hidden flex-none lg:block">
        <ul className="menu menu-horizontal">
          {navigationRoutes.map((route) => (
            <li key={route.label}>
              <Link href={route.href}>{route.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
