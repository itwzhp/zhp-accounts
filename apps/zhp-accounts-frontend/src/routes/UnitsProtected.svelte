<script lang="ts">
  import { onMount } from 'svelte'
  import type { AuthStore } from '../lib/stores/auth'
  import { authStore } from '../lib/stores/auth'
  import Units from './Units.svelte'

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
  <Units />
{/if}
