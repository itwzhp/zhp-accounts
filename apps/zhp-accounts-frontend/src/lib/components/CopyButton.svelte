<script lang="ts">
  import { Copy, Check } from 'lucide-svelte'

  interface Props {
    text: string
    title?: string
  }

  let { text, title = 'Kopiuj' }: Props = $props()

  let copied = $state(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      copied = true
      setTimeout(() => {
        copied = false
      }, 2000)
    } catch (e) {
      console.error('Failed to copy:', e)
    }
  }
</script>

<button
  onclick={handleCopy}
  class="btn btn-icon variant-soft"
  title={title}
>
  {#if copied}
    <Check class="w-4 h-4 text-primary" />
  {:else}
    <Copy class="w-4 h-4 text-blue" />
  {/if}
</button>
