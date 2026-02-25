<script lang="ts">
  import { onMount } from 'svelte'
  import { getAuthAdapter, getBackendAdapter, getBackendCommandsAdapter } from '@/lib/adapters'
  import type { ZhpMemberDetails, CreateAccountResponse } from 'zhp-accounts-types'
  import { ArrowLeft, MailCheck, ShieldAlert, KeyRound, RefreshCw, MailPlus, TriangleAlert } from 'lucide-svelte'
  import CopyButton from '@/lib/components/CopyButton.svelte'

  export let params: { unitId: string; memberId: string } = { unitId: '', memberId: '' }

  let member: ZhpMemberDetails | null = null
  let loading = true
  let error: string | null = null

  // Modal state using discriminated union
  type ModalState = 
    | { type: 'closed' }
    | { type: 'create-account-confirm' }
    | { type: 'create-account-loading' }
    | { type: 'create-account-success', accountData: CreateAccountResponse }
    | { type: 'create-account-error', error: string, errorCode: string }

  let modalState: ModalState = { type: 'closed' }
  let dialogElement: HTMLDialogElement

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
    modalState = { type: 'create-account-confirm' }
    dialogElement?.showModal()
  }

  async function confirmCreateAccount() {
    if (!member) return
    
    modalState = { type: 'create-account-loading' }
    
    try {
      const commandsAdapter = getBackendCommandsAdapter()
      const result = await commandsAdapter.createAccount({
        membershipNumber: member.membershipNumber
      })
      
      if (result.success) {
        // Refresh member data to update UI
        const backend = getBackendAdapter()
        const updatedMember = await backend.getMember(memberId)
        if (updatedMember) {
          member = updatedMember
        }
        modalState = { type: 'create-account-success', accountData: result.data }
      } else {
        modalState = { type: 'create-account-error', error: result.error, errorCode: result.errorCode }
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Nieznany błąd'
      modalState = { type: 'create-account-error', error: errorMsg, errorCode: 'FRONT_ERROR' }
    }
  }

  function closeModal() {
    modalState = { type: 'closed' }
    dialogElement?.close()
  }

  async function handlePasswordReset() {
    // TODO: Implement
    alert('Funkcja resetowania hasła zostanie wkrótce wdrożona')
  }

  async function handleMFAReset() {
    // TODO: Implement
    alert('Funkcja resetowania MFA zostanie wkrótce wdrożona')
  }

  async function handleCorrectEmail() {
    // TODO: Implement
    alert('Funkcja korekty emaila zostanie wkrótce wdrożona')
  }
</script>

<svelte:head>
  <title>Konta ZHP | {member ? `${member.name} ${member.surname}` : 'Członek'}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  {#if loading}
    <div class="text-center py-12">
      <div class="placeholder-circle w-12 h-12 mx-auto animate-pulse"></div>
      <p class="mt-4 text-surface-500-400-token">Ładowanie danych...</p>
    </div>
  {:else if error}
    <div class="alert variant-filled-error">
      <p>{error}</p>
    </div>
  {:else if member}
    <header class="mb-8 flex items-center gap-1">
      <button
        onclick={handleBack}
        class="btn btn-icon variant-soft-secondary hover:variant-filled-secondary transition-colors text-blue hover:text-blue-light"
        title="Wróć"
      >
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="text-3xl font-bold mb-2">
        {member.name} {member.surname}
      </h1>
      <p class="text-surface-600-300-token ml-2">
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
                  Brak konta ZHP dla tej osoby.
                </p>
                <button
                  onclick={handleCreateEmail}
                  class="btn variant-filled-primary flex items-center gap-2"
                >
                  <MailPlus class="w-4 h-4" />
                  Utwórz konto
                </button>
              </div>
            {:else if member.isAdmin}
              <div class="space-y-4">
                <p class="text-surface-600-300-token mb-2">
                  Email: <a href="mailto:{member.mail}" class="text-blue hover:text-blue-light">{member.mail}</a>
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
                  Email: <a href="mailto:{member.mail}" class="text-blue hover:text-blue-light">{member.mail}</a>
                </p>
                
                <div class="flex flex-wrap gap-3">
                  <button
                    onclick={handlePasswordReset}
                    class="btn variant-filled flex items-center gap-2"
                  >
                    <KeyRound class="w-4 h-4" />
                    Reset hasła
                  </button>
                  
                  <button
                    onclick={handleMFAReset}
                    class="btn variant-filled flex items-center gap-2"
                  >
                    <RefreshCw class="w-4 h-4" />
                    Reset MFA
                  </button>
                  
                  {#if member.canMailBeCorrected}
                    <button
                      onclick={handleCorrectEmail}
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

<dialog bind:this={dialogElement} class="modal-dialog m-auto p-0 rounded-xl max-w-xl w-full backdrop:bg-black/50">
  <div class="card p-6 w-full">
    <h3 class="text-2xl font-bold mb-4">Utwórz konto ZHP</h3>
    
    {#if modalState.type === 'create-account-confirm' || modalState.type === 'create-account-loading' || modalState.type === 'create-account-error'}
      <div class="space-y-4">
        <p class="text-surface-600-300-token">
          Czy chcesz założyć konto ZHP dla osoby <strong>{member?.name} {member?.surname}</strong>?
        </p>
        <p class="text-surface-600-300-token">
          Po założeniu konta otrzymasz login i hasło tymczasowe, które należy przekazać tej osobie.
        </p>
        
        {#if modalState.type === 'create-account-error'}
          <div class="alert variant-filled-error">
            <p class="font-semibold text-red flex items-center gap-2"><TriangleAlert class="w-5 h-5" /> Błąd tworzenia konta</p>
            <p class="text-sm mt-1">{modalState.error}</p>
            <p class="text-sm mt-1 font-mono">{modalState.errorCode}</p>
          </div>
        {/if}
        
        <div class="flex gap-3 justify-end mt-6">
          <button
            onclick={closeModal}
            disabled={modalState.type === 'create-account-loading'}
            class="btn variant-soft"
          >
            Anuluj
          </button>
          <button
            onclick={confirmCreateAccount}
            disabled={modalState.type === 'create-account-loading'}
            class="btn variant-filled-primary flex items-center gap-2"
          >
            {#if modalState.type === 'create-account-loading'}
              <div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Tworzenie...
            {:else}
              <MailPlus class="w-4 h-4" />
              Utwórz konto
            {/if}
          </button>
        </div>
      </div>
    {:else if modalState.type === 'create-account-success'}
      {@const accountData = modalState.accountData}
      <div class="space-y-4">
        <div class="alert variant-filled-success mb-4">
          <p class="font-semibold">Konto zostało utworzone pomyślnie!</p>
          <p class="text-sm mt-1">Przekaż poniższe dane osobie.</p>
        </div>
        
        <div class="space-y-3">
          <div>
            <label for="account-email" class="block text-sm font-medium mb-1">Login (adres email)</label>
            <div class="flex gap-2">
              <input
                id="account-email"
                type="text"
                readonly
                value={accountData.email}
                class="input flex-1 bg-surface-200-700-token"
              />
              <CopyButton text={accountData.email} title="Kopiuj login" />
            </div>
          </div>
          
          <div>
            <label for="account-password" class="block text-sm font-medium mb-1">Hasło tymczasowe</label>
            <div class="flex gap-2">
              <input
                id="account-password"
                type="text"
                readonly
                value={accountData.password}
                class="input flex-1 bg-surface-200-700-token font-mono"
              />
              <CopyButton text={accountData.password} title="Kopiuj hasło" />
            </div>
          </div>
        </div>
        
        <div class="alert variant-soft-warning mt-4">
          <p class="text-sm">
            <strong>Ważne:</strong> Te dane nie będą widoczne po zamknięciu okna. Upewnij się, że są zapisane lub przekazane osobie.
          </p>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            onclick={closeModal}
            class="btn variant-filled-primary"
          >
            Zamknij
          </button>
        </div>
      </div>
    {/if}
  </div>
</dialog>
