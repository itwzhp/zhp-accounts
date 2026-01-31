<script lang="ts">
  import { Mail, Shield, CircleQuestionMark, ExternalLink, CircleAlert, Key, Lock } from 'lucide-svelte'
  
  let expandedCard: string | null = null
  
  function toggleCard(cardId: string) {
    expandedCard = expandedCard === cardId ? null : cardId
  }
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <header class="text-center mb-12">
    <h1 class="text-4xl font-bold mb-4">Konta ZHP</h1>
    <p class="text-lg text-surface-600-300-token mb-6">
      Zarządzanie kontami Microsoft 365 dla członków ZHP
    </p>
  </header>

  <!-- Introduction Section -->
  <section class="card p-6 variant-soft-primary mb-8">
    <h2 class="text-2xl font-semibold mb-4">O kontach ZHP</h2>
    <p class="text-surface-700-200-token mb-4">
      Związek Harcerstwa Polskiego daje możliwość bezpłatnego korzystania z pakietu Microsoft 365 każdemu członkowi organizacji. 
      Konto ZHP jest także przydatne do zalogowania się do innych systemów, takich jak Tipi czy Harcerski Serwis Szkoleniowy.
    </p>
    <p class="text-surface-700-200-token">
      Microsoft 365 to zestaw w pełni profesjonalnych narzędzi do współpracy i komunikacji, dostępny w chmurze internetowej. 
      Harcerze, którzy posiadają konto w domenie zhp.pl, otrzymują pakiet usług zawierający pocztę elektroniczną, współdzielone kalendarze, 
      wiadomości błyskawiczne, wideokonferencje, przestrzeń na dysku wirtualnym oraz dostęp do internetowych wersji aplikacji pakietu biurowego 
      – Word, Excel, PowerPoint i OneNote. Dzięki zastosowaniu technologii chmury internetowej, dostęp do wszystkich funkcji pakietu 
      jest możliwy z dowolnego miejsca i w dowolnym czasie.
    </p>
  </section>
  
  <!-- Help Cards Section -->
  <section class="mb-12">
    <h2 class="text-2xl font-semibold mb-6 text-center">Najczęstsze problemy</h2>
    <div class="grid gap-4 md:grid-cols-3">
      <!-- Card: No Account -->
      <button
        on:click={() => toggleCard('no-account')}
        class="card p-6 variant-soft-warning text-left hover:variant-filled-warning transition-all"
      >
        <div class="flex items-center gap-3 mb-3">
          <CircleAlert class="w-7 h-7 text-warning-500" />
          <h3 class="text-lg font-semibold">Nie mam konta</h3>
        </div>
        {#if expandedCard === 'no-account'}
          <p class="text-sm text-surface-600-300-token mt-4 border-t pt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, 
            nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Donec euismod, nisl eget aliquam ultricies.
          </p>
        {/if}
      </button>

      <!-- Card: Forgot Password -->
      <button
        on:click={() => toggleCard('forgot-password')}
        class="card p-6 variant-soft-error text-left hover:variant-filled-error transition-all"
      >
        <div class="flex items-center gap-3 mb-3">
          <Key class="w-7 h-7 text-error-500" />
          <h3 class="text-lg font-semibold">Nie pamiętam hasła</h3>
        </div>
        {#if expandedCard === 'forgot-password'}
          <p class="text-sm text-surface-600-300-token mt-4 border-t pt-4">
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
            quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit.
          </p>
        {/if}
      </button>

      <!-- Card: 2FA Problem -->
      <button
        on:click={() => toggleCard('2fa-problem')}
        class="card p-6 variant-soft-success text-left hover:variant-filled-success transition-all"
      >
        <div class="flex items-center gap-3 mb-3">
          <Lock class="w-7 h-7 text-success-500" />
          <h3 class="text-lg font-semibold">Problem z 2FA</h3>
        </div>
        {#if expandedCard === '2fa-problem'}
          <p class="text-sm text-surface-600-300-token mt-4 border-t pt-4">
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim. 
            Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
          </p>
        {/if}
      </button>
    </div>
  </section>

  <!-- Quick Links Section -->
  <section class="mb-12">
    <h2 class="text-2xl font-semibold mb-6 text-center">Szybki dostęp</h2>
    <div class="grid gap-6 md:grid-cols-3">
      <div class="card p-6 variant-soft">
        <div class="flex items-center gap-3 mb-4">
          <Mail class="w-8 h-8 text-primary-500" />
          <h3 class="text-xl font-semibold">Poczta ZHP</h3>
        </div>
        <p class="text-surface-600-300-token mb-4">
          Dostęp do skrzynki pocztowej w domenie @zhp.pl
        </p>
        <a 
          href="https://outlook.cloud.microsoft.com/mail/" 
          target="_blank" 
          rel="noopener noreferrer"
          class="btn variant-filled-primary w-full justify-center"
        >
          Otwórz Outlook
          <ExternalLink class="w-4 h-4 ml-2" />
        </a>
      </div>

      <div class="card p-6 variant-soft">
        <div class="flex items-center gap-3 mb-4">
          <CircleQuestionMark class="w-8 h-8 text-secondary-500" />
          <h3 class="text-xl font-semibold">Poradnictwo</h3>
        </div>
        <p class="text-surface-600-300-token mb-4">
          Instrukcje i porady dotyczące korzystania z Microsoft 365
        </p>
        <a 
          href="https://pomoc.zhp.pl/spaces/O365/overview" 
          target="_blank" 
          rel="noopener noreferrer"
          class="btn variant-filled-secondary w-full justify-center"
        >
          Otwórz poradnik
          <ExternalLink class="w-4 h-4 ml-2" />
        </a>
      </div>

      <div class="card p-6 variant-soft">
        <div class="flex items-center gap-3 mb-4">
          <Shield class="w-8 h-8 text-tertiary-500" />
          <h3 class="text-xl font-semibold">Pomoc techniczna</h3>
        </div>
        <p class="text-surface-600-300-token mb-4">
          Zgłoś problem techniczny lub poproś o wsparcie
        </p>
        <a 
          href="https://helpdesk.zhp.pl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="btn variant-filled-tertiary w-full justify-center"
        >
          Zgłoś problem
          <ExternalLink class="w-4 h-4 ml-2" />
        </a>
      </div>
    </div>
  </section>

  <section class="text-center">
    <p class="text-surface-500-400-token text-sm">
      Aby zarządzać kontem, zaloguj się przy użyciu konta Microsoft 365
    </p>
    <!-- Login button will be added here later -->
  </section>
</div>
