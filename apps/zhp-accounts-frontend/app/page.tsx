import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const linkCards = [
  {
    image: '/images/create-account.webp',
    alt: 'Załóż konto',
    href: '/units',
    label:
      'Przed założeniem konta upewnij się, że w systemie Tipi masz wyrażone zgody na przetwarzanie danych osobowych oraz odznaczone opłacenie składki członkowskiej',
  },
  {
    image: '/images/reset-password.webp',
    alt: 'Resetuj hasło',
    href: 'https://passwordreset.microsoftonline.com/',
    target: '_blank',
    label: 'Zapomniałeś hasła? Tu je zresetujesz!',
  },
  {
    image: '/images/reset-2fa.webp',
    alt: 'Rozwiąż problem z dwuskładnikowym uwierzytelnianiem',
    href: 'https://pomoc.zhp.pl/pages/viewpage.action?pageId=1376376',
    target: '_blank',
    label: 'Masz problem z MFA? Kliknij tutaj, aby otrzymać pomoc.',
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto my-12 flex flex-col">
      <div className="prose max-w-none">
        <h1>Microsoft 365 w ZHP</h1>

        <p className="font-bold">
          Związek Harcerstwa Polskiego daje możliwość bezpłatnego korzystania z
          pakietu Microsoft 365 każdemu członkowi organizacji.
        </p>

        <p>
          Microsoft 365 to zestaw w pełni profesjonalnych narzędzi do współpracy
          i komunikacji, dostępny w chmurze internetowej. Harcerze, którzy chcą
          mieć konto w zhp.net.pl, otrzymają pakiet usług zawierających pocztę
          elektroniczną, współdzielone kalendarze, wiadomości błyskawiczne,
          wideokonferencje, przestrzeń na dysku wirtualnym oraz dostęp do
          internetowych wersji aplikacji pakietu biurowego – Word, Excel,
          PowerPoint i OneNote. Dzięki zastosowaniu technologii chmury
          internetowej dostęp do wszystkich funkcji pakietu będzie dostępny z
          dowolnego miejsca i w dowolnym czasie.
        </p>

        <h2>Masz już konto Microsoft 365 od ZHP?</h2>

        <div className="flex flex-wrap justify-center gap-1">
          <Link
            href="https://portal.office.com/"
            target="_blank"
            className={cn(buttonVariants(), 'no-underline')}
          >
            Zaloguj się do konta Microsoft 365
          </Link>

          <Link
            href="https://pomoc.zhp.pl/login.action"
            target="_blank"
            className={cn(buttonVariants(), 'no-underline')}
          >
            Zaloguj się do serwisu pomoc.zhp.pl
          </Link>
        </div>

        <h2>
          Masz problem ze swoim kontem Microsoft 365 od ZHP? <br />
          Wybierz, jak możemy ci pomóc:
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {linkCards.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.target ?? '_self'}
              className="card bg-base-100 no-underline transition duration-200 ease-in-out hover:scale-100 md:scale-90"
            >
              <Card>
                <CardHeader className="p-0">
                  <Image
                    className="m-0 rounded-t-xl"
                    src={link.image}
                    alt={link.alt}
                    width={1024}
                    height={1024}
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </CardHeader>
                <CardContent>
                  <p className="text-center">{link.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
