<script lang="ts">
  import { currentAccount, isAuthenticated } from '@/lib/stores'
  import { User, Mail, MapPin, Shield } from 'lucide-svelte'
  import { link } from 'svelte-spa-router'
</script>

<div class="container mx-auto px-4 py-8 max-w-2xl">
  <header class="mb-8">
    <h1 class="text-3xl font-bold mb-2">Mój profil</h1>
    <p class="text-surface-600-300-token">
      Informacje o Twoim koncie Microsoft 365
    </p>
  </header>

  {#if $isAuthenticated && $currentAccount}
    <div class="card p-6">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center">
          <User class="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 class="text-xl font-semibold">{$currentAccount.mail}</h2>
          <p class="text-surface-500-400-token">{$currentAccount.membershipNumber}</p>
        </div>
      </div>

      <dl class="space-y-4">
        <div class="flex items-center gap-3">
          <Mail class="w-5 h-5 text-surface-400" />
          <div>
            <dt class="text-sm text-surface-500-400-token">Email</dt>
            <dd>{$currentAccount.mail}</dd>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <MapPin class="w-5 h-5 text-surface-400" />
          <div>
            <dt class="text-sm text-surface-500-400-token">Region / Hufiec</dt>
            <dd>{$currentAccount.region} {$currentAccount.district ? `/ ${$currentAccount.district}` : ''}</dd>
          </div>
        </div>

        {#if $currentAccount.isAdmin}
          <div class="flex items-center gap-3">
            <Shield class="w-5 h-5 text-warning-500" />
            <div>
              <dt class="text-sm text-surface-500-400-token">Uprawnienia</dt>
              <dd class="text-warning-500">Administrator</dd>
            </div>
          </div>
        {/if}
      </dl>
    </div>
  {:else}
    <div class="card p-8 text-center">
      <User class="w-16 h-16 mx-auto text-surface-400 mb-4" />
      <h2 class="text-xl font-semibold mb-2">Nie jesteś zalogowany</h2>
      <p class="text-surface-500-400-token mb-6">
        Zaloguj się, aby zobaczyć informacje o swoim koncie
      </p>
      <a href="/" use:link class="btn variant-filled-primary">
        Wróć do strony głównej
      </a>
    </div>
  {/if}
</div>
