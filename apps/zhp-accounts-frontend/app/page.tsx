'use client';

export default function Home() {
  return (
    <main className="container mx-auto px-8 py-12">
      <div className="flex flex-col items-center gap-8">
        <div className="prose w-full max-w-4xl">
          <h1>Microsoft 365 w ZHP</h1>
          <p className="font-bold">
            Związek Harcerstwa Polskiego daje możliwość bezpłatnego korzystania z pakietu
            Microsoft 365 każdemu członkowi organizacji.
          </p>
          <p>
            Microsoft 365 to zestaw w pełni profesjonalnych narzędzi do współpracy i komunikacji,
            dostępny w chmurze internetowej. Harcerze, którzy chcą mieć konto w zhp.net.pl,
            otrzymają pakiet usług zawierających pocztę elektroniczną, współdzielone kalendarze,
            wiadomości błyskawiczne, wideokonferencje, przestrzeń na dysku wirtualnym oraz dostęp
            do internetowych wersji aplikacji pakietu biurowego – Word, Excel, PowerPoint i OneNote.
            Dzięki zastosowaniu technologii chmury internetowej dostęp do wszystkich funkcji pakietu
            będzie dostępny z dowolnego miejsca i w dowolnym czasie.
          </p>
        </div>
      </div>
    </main>
  );
}
