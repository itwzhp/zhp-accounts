<script lang="ts">
  import { onMount } from 'svelte'
  import type { AuthStore } from '../lib/stores/auth'
  import { authStore } from '../lib/stores/auth'
  import Members from './Members.svelte'

  let { params }: { params?: Record<string, string> } = $props()
  let isAuthenticated = $state(false)
  let isInitialized = $state(false)

  onMount(() => {
    const unsubscribe = authStore.subscribe((state: AuthStore) => {
      isAuthenticated = state.isAuthenticated
      isInitialized = true

      if (!isAuthenticated) {
        window.location.hash = '#/'
      }
    })

    return unsubscribe
  })
</script>

{#if isInitialized && isAuthenticated}
  <Members params={params as { id: string }} />
{/if}
