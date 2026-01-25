<script lang="ts">
  import { Mail, Shield, HelpCircle, ExternalLink } from 'lucide-svelte'
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <header class="text-center mb-12">
    <h1 class="text-4xl font-bold mb-4">ZHP Accounts</h1>
    <p class="text-lg text-surface-600-300-token">
      System zarządzania kontami Microsoft 365 dla członków ZHP
    </p>
  </header>

  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <!-- Info Card: Email -->
    <div class="card p-6 variant-soft">
      <div class="flex items-center gap-3 mb-4">
        <Mail class="w-8 h-8 text-primary-500" />
        <h2 class="text-xl font-semibold">Poczta ZHP</h2>
      </div>
      <p class="text-surface-600-300-token mb-4">
        Każdy członek ZHP może otrzymać adres e-mail w domenie @zhp.net.pl
      </p>
      <a 
        href="https://outlook.office.com" 
        target="_blank" 
        rel="noopener noreferrer"
        class="btn variant-filled-primary"
      >
        Otwórz Outlook
        <ExternalLink class="w-4 h-4 ml-2" />
      </a>
    </div>

    <!-- Info Card: Security -->
    <div class="card p-6 variant-soft">
      <div class="flex items-center gap-3 mb-4">
        <Shield class="w-8 h-8 text-primary-500" />
        <h2 class="text-xl font-semibold">Bezpieczeństwo</h2>
      </div>
      <p class="text-surface-600-300-token mb-4">
        Włącz uwierzytelnianie dwuskładnikowe (2FA) dla dodatkowej ochrony konta
      </p>
      <a 
        href="https://mysignins.microsoft.com/security-info" 
        target="_blank" 
        rel="noopener noreferrer"
        class="btn variant-filled-secondary"
      >
        Ustawienia 2FA
        <ExternalLink class="w-4 h-4 ml-2" />
      </a>
    </div>

    <!-- Info Card: Help -->
    <div class="card p-6 variant-soft">
      <div class="flex items-center gap-3 mb-4">
        <HelpCircle class="w-8 h-8 text-primary-500" />
        <h2 class="text-xl font-semibold">Pomoc</h2>
      </div>
      <p class="text-surface-600-300-token mb-4">
        Potrzebujesz pomocy? Skontaktuj się z administratorem chorągwi
      </p>
      <a 
        href="mailto:pomoc@zhp.net.pl"
        class="btn variant-filled-tertiary"
      >
        Napisz do nas
        <Mail class="w-4 h-4 ml-2" />
      </a>
    </div>
  </div>

  <section class="mt-12 text-center">
    <p class="text-surface-500-400-token text-sm">
      Aby zarządzać kontem, zaloguj się przy użyciu konta Microsoft 365
    </p>
    <!-- Login button will be added here later -->
  </section>
</div>
