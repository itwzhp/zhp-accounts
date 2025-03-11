import Link from 'next/link';
import Image from 'next/image';
import { HTMLAttributeAnchorTarget } from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
// import {
//   Card,
//   CardContent, CardDescription,
//   CardFooter,
//   CardHeader, CardTitle
// } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <div className="flex flex-col">
        <div className="prose max-w-none py-12">
          <h1>Microsoft 365 w ZHP</h1>

          <p className="font-bold">
            Związek Harcerstwa Polskiego daje możliwość bezpłatnego korzystania
            z pakietu Microsoft 365 każdemu członkowi organizacji.
          </p>

          <p>
            Microsoft 365 to zestaw w pełni profesjonalnych narzędzi do
            współpracy i komunikacji, dostępny w chmurze internetowej. Harcerze,
            którzy chcą mieć konto w zhp.net.pl, otrzymają pakiet usług
            zawierających pocztę elektroniczną, współdzielone kalendarze,
            wiadomości błyskawiczne, wideokonferencje, przestrzeń na dysku
            wirtualnym oraz dostęp do internetowych wersji aplikacji pakietu
            biurowego – Word, Excel, PowerPoint i OneNote. Dzięki zastosowaniu
            technologii chmury internetowej dostęp do wszystkich funkcji pakietu
            będzie dostępny z dowolnego miejsca i w dowolnym czasie.
          </p>

          <h2>Masz już konto Microsoft 365 od ZHP?</h2>

          <div className="flex flex-wrap justify-center gap-1">
            <Link
              href="https://portal.office.com/"
              target="_blank"
              className={buttonVariants({ variant: 'default' })}
            >
              Zaloguj się do konta Microsoft 365
            </Link>

            <Link
              href="https://pomoc.zhp.pl/login.action"
              target="_blank"
              className={cn(buttonVariants())}
            >
              Zaloguj się do serwisu pomoc.zhp.pl
            </Link>
          </div>

          <h2>
            Masz problem ze swoim kontem Microsoft 365 od ZHP? <br />
            Wybierz, jak możemy ci pomóc:
          </h2>

          {/*<Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>*/}

          <div className="grid gap-4 md:grid-cols-3">
            {cards.map((data) => (
              <LinkCard key={data.image} {...data} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

interface LinkCardData {
  image: string;
  alt: string;
  href: string;
  target?: HTMLAttributeAnchorTarget;
  body: string;
}

const cards: LinkCardData[] = [
  {
    image: '/images/create-account.webp',
    alt: 'Załóż konto',
    href: '/accounts/activate',
    body: 'Przed założeniem konta upewnij się, że w systemie Tipi masz wyrażone zgody na przetwarzanie danych osobowych oraz odznaczone opłacenie składki członkowskiej',
  },
  {
    image: '/images/reset-password.webp',
    alt: 'Resetuj hasło',
    href: 'https://passwordreset.microsoftonline.com/',
    target: '_blank',
    body: 'Zapomniałeś hasła? Tu je zresetujesz!',
  },
  {
    image: '/images/reset-2fa.webp',
    alt: 'Rozwiąż problem z dwuskładnikowym uwierzytelnianiem',
    href: 'https://pomoc.zhp.pl/pages/viewpage.action?pageId=1376376',
    target: '_blank',
    body: 'Masz problem z MFA? Kliknij tutaj, aby otrzymać pomoc.',
  },
];

function LinkCard({ image, alt, href, target, body }: LinkCardData) {
  return (
    <Link
      href={href}
      target={target ?? '_self'}
      className="card bg-base-100 no-underline shadow-xl transition duration-200 ease-in-out hover:scale-100 md:scale-90"
    >
      <figure className="m-0">
        <Image
          src={image}
          alt={alt}
          width={1024}
          height={1024}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
      </figure>
      <div className="card-body content-center p-4 text-center">
        <p>{body}</p>
      </div>
    </Link>
  );
}
