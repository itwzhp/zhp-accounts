<script lang="ts">
  import { onMount } from 'svelte'
  import { getAuthAdapter, getBackendAdapter } from '@/lib/adapters'
  import type { ZhpMemberDetails } from 'zhp-accounts-types'
  import { ArrowLeft, MailCheck, ShieldAlert, KeyRound, RefreshCw, MailPlus } from 'lucide-svelte'
  import { link } from 'svelte-spa-router'

  export let params: { unitId: string; memberId: string } = { unitId: '', memberId: '' }

  let member: ZhpMemberDetails | null = null
  let loading = true
  let error: string | null = null
  let actionLoading = false

  $: unitId = parseInt(params.unitId, 10)
  $: memberId = params.memberId

  function handleBack() {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.history.replaceState(null, '', `#/units/${unitId}/members`)
    }
  }

  onMount(async () => {
    try {
      const authAdapter = getAuthAdapter()
      const isAuthenticated = await authAdapter.isAuthenticated()
      if (!isAuthenticated) {
        window.location.hash = '#/'
        return
      }
      const backend = getBackendAdapter()
      member = await backend.getMember(memberId)
      if (!member) {
        error = 'Nie znaleziono członka'
      }
    } catch (e) {
      error = e instanceof Error ? e.message : 'Błąd ładowania danych'
    } finally {
      loading = false
    }
  })

  async function handleCreateEmail() {
    actionLoading = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Funkcja tworzenia emaila zostanie wkrótce wdrożona')
    } finally {
      actionLoading = false
    }
  }

  async function handlePasswordReset() {
    actionLoading = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Funkcja resetowania hasła zostanie wkrótce wdrożona')
    } finally {
      actionLoading = false
    }
  }

  async function handleMFAReset() {
    actionLoading = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Funkcja resetowania MFA zostanie wkrótce wdrożona')
    } finally {
      actionLoading = false
    }
  }

  async function handleCorrectEmail() {
    actionLoading = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Funkcja korekty emaila zostanie wkrótce wdrożona')
    } finally {
      actionLoading = false
    }
  }
</script>

<svelte:head>
  <title>Konta ZHP | {member ? `${member.name} ${member.surname}` : 'Członek'}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <button
    onclick={handleBack}
    class="inline-flex items-center gap-2 text-primary-500 hover:underline mb-4 bg-none border-none cursor-pointer p-0"
    title="Wróć do poprzedniej strony"
  >
    <ArrowLeft class="w-4 h-4" />
    Powrót
  </button>

  {#if loading}
    <div class="text-center py-12">
      <div class="placeholder-circle w-12 h-12 mx-auto animate-pulse"></div>
      <p class="mt-4 text-surface-500-400-token">Ładowanie danych członka...</p>
    </div>
  {:else if error}
    <div class="alert variant-filled-error">
      <p>{error}</p>
    </div>
  {:else if member}
    <header class="mb-8">
      <h1 class="text-3xl font-bold mb-2">
        {member.name} {member.surname}
      </h1>
      <p class="text-surface-600-300-token">
        {member.membershipNumber}
      </p>
    </header>

    <div class="space-y-6">
      <div class="card">
        <div class="flex items-start gap-4">
          <div class="flex-1">
            <h2 class="text-xl font-semibold mb-2">Status konta ZHP</h2>
            
            {#if member.mail === null}
              <div class="space-y-4">
                <p class="text-surface-600-300-token">
                  Członek nie posiada konta ZHP.
                </p>
                <button
                  onclick={handleCreateEmail}
                  disabled={actionLoading}
                  class="btn variant-filled-primary flex items-center gap-2"
                >
                  <MailPlus class="w-4 h-4" />
                  Utwórz konto
                </button>
              </div>
            {:else if member.isAdmin}
              <div class="space-y-4">
                <p class="text-surface-600-300-token mb-2">
                  Email: <a href="mailto:{member.mail}" class="text-primary-500 hover:underline">{member.mail}</a>
                </p>
                <div class="alert variant-filled-warning">
                  <div class="flex items-start gap-3">
                    <ShieldAlert class="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p class="font-semibold mb-1">Konto administracyjne</p>
                      <p class="text-sm">
                        To konto ma uprawnienia administracyjne. W przypadku problemów technicznych skontaktuj się z Wydziałem IT.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            {:else}
              <div class="space-y-4">
                <p class="text-surface-600-300-token mb-4">
                  Email: <a href="mailto:{member.mail}" class="text-primary-500 hover:underline">{member.mail}</a>
                </p>
                
                <div class="flex flex-wrap gap-3">
                  <button
                    onclick={handlePasswordReset}
                    disabled={actionLoading}
                    class="btn variant-filled flex items-center gap-2"
                  >
                    <KeyRound class="w-4 h-4" />
                    Reset hasła
                  </button>
                  
                  <button
                    onclick={handleMFAReset}
                    disabled={actionLoading}
                    class="btn variant-filled flex items-center gap-2"
                  >
                    <RefreshCw class="w-4 h-4" />
                    Reset MFA
                  </button>
                  
                  {#if member.canMailBeCorrected}
                    <button
                      onclick={handleCorrectEmail}
                      disabled={actionLoading}
                      class="btn variant-soft flex items-center gap-2"
                    >
                      <MailCheck class="w-4 h-4" />
                      Popraw adres email
                    </button>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>

    </div>
  {/if}
</div>
