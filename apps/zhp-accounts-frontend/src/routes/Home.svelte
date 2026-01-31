<script lang="ts">
  import { onMount } from "svelte";
  import {
    Mail,
    MessageCircleQuestionMark,
    BookText,
    ExternalLink,
    UserPlus,
    LockKeyhole,
    UserLock,
  } from "lucide-svelte";

  type HelpTabId = "no-account" | "forgot-password" | "2fa-problem";

  const helpTabs: Array<{
    id: HelpTabId;
    title: string;
    icon: typeof UserPlus;
    color: string;
    content: string;
  }> = [
    {
      id: "no-account",
      title: "Nie mam konta",
      icon: UserPlus,
      color: "color-purple-light",
      content:
        "Aby założyć konto upewnij się, że w systemie Tipi masz wyrażone zgody na przetwarzanie danych osobowych oraz odznaczone opłacenie składki członkowskiej. Następnie wypełnij <a class='underline' href='https://forms.office.com/Pages/ResponsePage.aspx?id=Ho024XU55kyJPfw1H9RNzagYEwNUSyJIv9jtKjNrRIJUNE02SjMwNkpYMVBBNUtUUklSNU9IVTlCSS4u'>formularz aktywacji konta</a>.",
    },
    {
      id: "forgot-password",
      title: "Nie pamiętam hasła",
      icon: LockKeyhole,
      color: "color-red-light",
      content:
        "Jeśli nie pamiętasz hasła do swojego konta ZHP, poproś swojego przełożonego o wypełnienie odpowiedniego <a class='underline' href='https://jira.zhp.pl/plugins/servlet/desk/portal/7/create/49'>wniosku na helpdesku</a>.",
    },
    {
      id: "2fa-problem",
      title: "Problem z 2FA",
      icon: UserLock,
      color: "color-blue-light",
      content:
        "Jeśli masz problem z dwuetapową weryfikacją (MFA), poproś swojego przełożonego o wypełnienie odpowiedniego <a class='underline' href='https://jira.zhp.pl/plugins/servlet/desk/portal/7/create/49'>wniosku na helpdesku</a>.",
    },
  ];

  let expandedCard: HelpTabId | null = null;
  let maxContentHeight = 0;

  function selectCard(cardId: HelpTabId) {
    expandedCard = cardId;
  }

  function calculateMaxHeight() {
    const contentElements = document.querySelectorAll(".help-tab-content");
    const contentHeights: number[] = [];
    contentElements.forEach((el) => {
      const height = (el as HTMLElement).offsetHeight;
      contentHeights.push(height);
    });
    maxContentHeight = Math.max(0, ...contentHeights);
  }

  onMount(() => {
    calculateMaxHeight();
    window.addEventListener("resize", calculateMaxHeight);

    return () => {
      window.removeEventListener("resize", calculateMaxHeight);
    };
  });
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  <!-- Introduction Section -->
  <section class="card variant-soft-primary mb-8">
    <p class="text-surface-700-200-token mb-4">
      Związek&nbsp;Harcerstwa&nbsp;Polskiego daje możliwość bezpłatnego
      korzystania z pakietu Microsoft&nbsp;365 każdemu członkowi organizacji.
      Konto&nbsp;ZHP jest także przydatne do zalogowania się do innych systemów,
      takich jak Tipi czy Harcerski&nbsp;Serwis&nbsp;Szkoleniowy.
    </p>
    <p class="text-surface-700-200-token">
      Microsoft&nbsp;365 to zestaw w pełni profesjonalnych narzędzi do
      współpracy i komunikacji, dostępny w chmurze internetowej. Harcerze,
      którzy posiadają konto w domenie zhp.pl, otrzymują pakiet usług
      zawierający pocztę elektroniczną, współdzielone kalendarze, wiadomości
      błyskawiczne, wideokonferencje, przestrzeń na dysku wirtualnym oraz dostęp
      do internetowych wersji aplikacji pakietu biurowego – Word, Excel,
      PowerPoint i&nbsp;OneNote. Dzięki zastosowaniu technologii chmury
      internetowej, dostęp do wszystkich funkcji pakietu jest możliwy z
      dowolnego miejsca i w dowolnym czasie.
    </p>
  </section>

  <!-- Help Cards Section -->
  <section class="mb-12">
    <h2 class="text-2xl font-semibold mb-8">Najczęstsze&nbsp;sprawy</h2>

    <div class="card variant-soft">
      <div
        role="tablist"
        aria-label="Najczęstsze sprawy"
        class="flex flex-col gap-3 md:flex-row md:gap-4"
      >
        {#each helpTabs as tab}
          <button
            type="button"
            role="tab"
            aria-selected={expandedCard === tab.id}
            on:click={() => selectCard(tab.id)}
            class={`flex-1 card  text-left transition-all variant-soft`}
          >
            <div class="flex items-center gap-3 border-b-2"  class:border-transparent={expandedCard !== tab.id} style={`color: var(--${tab.color})`}>
              <svelte:component
                this={tab.icon}
                class="w-8 h-8"
                style={`color: var(--${tab.color})`}
              />
              <span class="text-xl font-semibold text-black">{tab.title}</span>
            </div>
          </button>
        {/each}
      </div>

      <div
        class="mt-6 rounded-xl border-surface-200-700-token bg-surface-50-900-token p-5 md:p-6 relative"
        style={`min-height: ${maxContentHeight ? `${maxContentHeight}px` : "8rem"}`}
      >
        {#each helpTabs as tab}
          <p
            class="help-tab-content text-sm md:text-base text-surface-600-300-token leading-relaxed absolute top-0 left-0 w-full p-5 md:p-6 transition-opacity duration-300"
            class:opacity-0={expandedCard !== tab.id}
            class:opacity-100={expandedCard === tab.id}
            class:z-10={expandedCard === tab.id}
          >
            {@html tab.content}
          </p>
        {/each}
        <p
          class="help-tab-content text-sm md:text-base text-surface-600-300-token leading-relaxed absolute top-0 left-0 w-full p-5 md:p-6 text-center transition-opacity duration-300"
          class:opacity-0={expandedCard !== null}
          class:opacity-100={expandedCard === null}
        >
          Wybierz temat powyżej aby zobaczyć pomoc
        </p>
      </div>
    </div>
  </section>

  <!-- Quick Links Section -->
  <section class="mb-12">
    <h2 class="text-2xl font-semibold mb-8">Szybki dostęp</h2>
    <div class="grid gap-6 md:grid-cols-3">
      <div class="card variant-soft">
        <a
          href="https://outlook.cloud.microsoft.com/mail/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="flex items-center gap-3 mb-4">
            <Mail class="w-8 h-8" style="color: var(--color-blue-light)" />
            <h3 class="text-xl font-semibold">Poczta ZHP</h3>
            <ExternalLink class="w-5 h-5" />
          </div>
          <p class="text-surface-600-300-token mb-4">
            Otwórz skrzynkę pocztową ZHP
          </p>
        </a>
      </div>

      <div class="card variant-soft">
        <a
          href="https://pomoc.zhp.pl/spaces/O365/overview"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="flex items-center gap-3 mb-4">
            <BookText class="w-8 h-8" style="color: var(--color-purple-light)" />
            <h3 class="text-xl font-semibold">Poradnictwo</h3>
            <ExternalLink class="w-5 h-5" />
          </div>
          <p class="text-surface-600-300-token mb-4">
            Przejrzyj instrukcje i porady dotyczące korzystania z Microsoft 365
          </p>
        </a>
      </div>

      <div class="card variant-soft">
        <a
          href="https://helpdesk.zhp.pl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="flex items-center gap-3 mb-4">
            <MessageCircleQuestionMark class="w-8 h-8" style="color: var(--color-red-light)" />
            <h3 class="text-xl font-semibold">Pomoc techniczna</h3>
            <ExternalLink class="w-5 h-5" />
          </div>
          <p class="text-surface-600-300-token mb-4">
            Zgłoś problem techniczny na Helpdesku
          </p>
        </a>
      </div>
    </div>
  </section>

</div>
