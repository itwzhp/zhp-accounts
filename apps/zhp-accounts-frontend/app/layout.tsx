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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={clsx(museo.className, inter.className)}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-1">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/identifier-zhp-white.png"
            height={60}
            width={155}
            alt="Związek Harcerstwa Polskiego"
          />
          <span className="text-xl font-medium">
            aktywacja.zhp.pl
          </span>
        </Link>
      </div>

      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Aktywacja</Link>
          </li>
          <li>
            <Link href="/">Resetuj hasło</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
