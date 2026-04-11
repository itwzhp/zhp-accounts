<script lang="ts">
  import { getBackendCommandsAdapter } from '@/lib/adapters'
  import type { CreateAccountResponse, ZhpMemberDetails } from 'zhp-accounts-types'
  import { MailPlus, TriangleAlert } from 'lucide-svelte'
  import CopyButton from './CopyButton.svelte'

  interface Props {
    isOpen: boolean
    member: ZhpMemberDetails
    onClose: () => void
    onSuccess: () => void
  }

  let { 
    isOpen,
    member,
    onClose,
    onSuccess
  }: Props = $props()

  // Internal state machine
  type InternalState = 
    | { type: 'confirm' }
    | { type: 'loading' }
    | { type: 'success', accountData: CreateAccountResponse }
    | { type: 'error', error: string, errorCode: string }

  let internalState: InternalState = $state({ type: 'confirm' })
  let dialogElement: HTMLDialogElement
  let sendByEmail = $state(false)
  let notificationEmail = $state('')

  // Show/hide dialog based on isOpen prop
  $effect(() => {
    if (isOpen) {
      internalState = { type: 'confirm' }
      sendByEmail = false
      notificationEmail = ''
      dialogElement.showModal()
    } else {
      dialogElement.close()
    }
  })

  function getNotificationEmail(): string | undefined {
    if (!sendByEmail) {
      return undefined
    }

    const trimmedEmail = notificationEmail.trim()
    if (!trimmedEmail) {
      return undefined
    }

    return trimmedEmail
  }

  async function confirmCreateAccount() {
    internalState = { type: 'loading' }
    
    try {
      const commandsAdapter = getBackendCommandsAdapter()
      const result = await commandsAdapter.createAccount({
        membershipNumber: member.membershipNumber,
        notificationEmail: getNotificationEmail(),
      })
      
      if (result.success) {
        internalState = { type: 'success', accountData: result.data }
        onSuccess()
      } else {
        internalState = { type: 'error', error: result.error, errorCode: result.errorCode }
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Nieznany błąd'
      internalState = { type: 'error', error: errorMsg, errorCode: 'FRONT_ERROR' }
    }
  }

  function handleClose() {
    onClose()
  }
</script>

<dialog bind:this={dialogElement} class="modal-dialog m-auto p-0 rounded-xl max-w-xl w-full backdrop:bg-black/50">
  <div class="card p-6 w-full">
    <h3 class="text-2xl font-bold mb-4">Utwórz konto ZHP</h3>
    
    {#if internalState.type === 'confirm' || internalState.type === 'loading' || internalState.type === 'error'}
      <div class="space-y-4">
        <p class="text-surface-600-300-token">
          Czy chcesz założyć konto ZHP dla osoby <strong>{member.name} {member.surname}</strong>?
        </p>
        <p class="text-surface-600-300-token">
          Po założeniu konta otrzymasz login i hasło tymczasowe, które należy przekazać tej osobie.
        </p>

        <label class="flex items-center gap-2">
          <input
            type="checkbox"
            bind:checked={sendByEmail}
          />
          <span>Wyślij hasło mailem</span>
        </label>

        {#if sendByEmail}
          <div>
            <label for="notification-email-create" class="block text-sm font-medium mb-1">Adres email do powiadomienia</label>
            <input
              id="notification-email-create"
              type="email"
              bind:value={notificationEmail}
              class="input w-full notification-email-input"
              placeholder="przykladowy.adres@email.pl"
            />
          </div>
        {/if}
        
        {#if internalState.type === 'error'}
          <div class="alert variant-filled-error">
            <p class="font-semibold text-red flex items-center gap-2"><TriangleAlert class="w-5 h-5" /> Błąd tworzenia konta</p>
            <p class="text-sm mt-1">{internalState.error}</p>
            <p class="text-sm mt-1 font-mono">{internalState.errorCode}</p>
          </div>
        {/if}
        
        <div class="flex gap-3 justify-end mt-6">
          <button
            onclick={handleClose}
            disabled={internalState.type === 'loading'}
            class="btn variant-soft"
          >
            Anuluj
          </button>
          <button
            onclick={confirmCreateAccount}
            disabled={internalState.type === 'loading'}
            class="btn variant-filled-primary flex items-center gap-2"
          >
            {#if internalState.type === 'loading'}
              <div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Tworzenie...
            {:else}
              <MailPlus class="w-4 h-4" />
              Utwórz konto
            {/if}
          </button>
        </div>
      </div>
    {:else if internalState.type === 'success'}
      {@const accountData = internalState.accountData}
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
                value={accountData.account.upn}
                class="input flex-1 bg-surface-200-700-token"
              />
              <CopyButton text={accountData.account.upn} title="Kopiuj login" />
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
            onclick={handleClose}
            class="btn variant-filled-primary"
          >
            Zamknij
          </button>
        </div>
      </div>
    {/if}
  </div>
</dialog>

<style>
  .notification-email-input::placeholder {
    opacity: 0.45;
  }
</style>
