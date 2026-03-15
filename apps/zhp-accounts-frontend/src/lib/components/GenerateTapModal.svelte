<script lang="ts">
  import { getBackendCommandsAdapter } from '@/lib/adapters'
  import type { GenerateTapResponse, ZhpMemberDetails } from 'zhp-accounts-types'
  import { KeyRound, TriangleAlert } from 'lucide-svelte'
  import CopyButton from './CopyButton.svelte'

  interface Props {
    isOpen: boolean
    member: ZhpMemberDetails
    onClose: () => void
  }

  let { 
    isOpen,
    member,
    onClose
  }: Props = $props()

  // Internal state machine
  type InternalState = 
    | { type: 'confirm' }
    | { type: 'loading' }
    | { type: 'success', tapData: GenerateTapResponse }
    | { type: 'error', error: string, errorCode: string }

  let internalState: InternalState = $state({ type: 'confirm' })
  let dialogElement: HTMLDialogElement

  // Show/hide dialog based on isOpen prop
  $effect(() => {
    if (isOpen) {
      internalState = { type: 'confirm' }
      dialogElement.showModal()
    } else {
      dialogElement.close()
    }
  })

  async function confirmGenerateTap() {
    internalState = { type: 'loading' }

    if(!member.mail) {
      internalState = { type: 'error', error: 'Członek nie posiada przypisanego adresu e-mail', errorCode: 'FRONT_NOEMAIL' }
      return
    }
    
    try {
      const commandsAdapter = getBackendCommandsAdapter()
      const result = await commandsAdapter.generateTap({
        membershipNumber: member.membershipNumber
      })
      
      if (result.success) {
        internalState = { type: 'success', tapData: result.data }
      } else {
        internalState = { type: 'error', error: result.error, errorCode: result.errorCode }
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Nieznany błąd'
      internalState = { type: 'error', error: errorMsg, errorCode: 'FRONT_TAP_ERROR' }
    }
  }

  function handleClose() {
    onClose()
  }
</script>

<dialog bind:this={dialogElement} class="modal-dialog m-auto p-0 rounded-xl max-w-xl w-full backdrop:bg-black/50">
  <div class="card p-6 w-full">
    <h3 class="text-2xl font-bold mb-4">Hasło tymczasowe</h3>
    
    {#if internalState.type === 'confirm' || internalState.type === 'loading' || internalState.type === 'error'}
      <div class="space-y-4">
        <p class="text-surface-600-300-token">
          Czy chcesz wygenerować hasło tymczasowe dla konta <strong>{member.mail}</strong>?
        </p>
        <p class="text-surface-600-300-token">
          Aby rozwiązać problem z zapomnianym hasłem lub utraconym dostępem do MFA wygeneruj hasło tymczasowe i przekaż je członkowi.
        </p>
        
        {#if internalState.type === 'error'}
          <div class="alert variant-filled-error">
            <p class="font-semibold text-red flex items-center gap-2"><TriangleAlert class="w-5 h-5" /> Błąd generowania hasła tymczasowego</p>
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
            onclick={confirmGenerateTap}
            disabled={internalState.type === 'loading'}
            class="btn variant-filled-primary flex items-center gap-2"
          >
            {#if internalState.type === 'loading'}
              <div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Generowanie...
            {:else}
              <KeyRound class="w-4 h-4" />
              Wygeneruj
            {/if}
          </button>
        </div>
      </div>
    {:else if internalState.type === 'success'}
      {@const tapData = internalState.tapData}
      <div class="space-y-4">
        <div class="alert variant-filled-success mb-4">
          <p class="font-semibold">Hasło tymczasowe zostało wygenerowane pomyślnie!</p>
          <p class="text-sm mt-1">Przekaż poniższe hasło osobie.</p>
        </div>
        
        <div class="space-y-3">
          <div>
            <label for="tap-password" class="block text-sm font-medium mb-1">Hasło tymczasowe (TAP)</label>
            <div class="flex gap-2">
              <input
                id="tap-password"
                type="text"
                readonly
                value={tapData.tap}
                class="input flex-1 bg-surface-200-700-token font-mono"
              />
              <CopyButton text={tapData.tap} title="Kopiuj hasło tymczasowe" />
            </div>
          </div>
          
          <div>
            <div class="block text-sm font-medium mb-1">Ważne do</div>
            <p class="text-surface-600-300-token font-mono">
              {new Date(tapData.expiresAt).toLocaleString('pl-PL', {
                timeZone: 'Europe/Warsaw',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              })}
            </p>
          </div>
        </div>
        
        <div class="alert variant-soft-warning mt-4">
          <p class="text-sm">
            <strong>Ważne:</strong> To hasło nie będzie widoczne po zamknięciu okna. Upewnij się, że jest zapisane lub przekazane zainteresowanej osobie.
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
