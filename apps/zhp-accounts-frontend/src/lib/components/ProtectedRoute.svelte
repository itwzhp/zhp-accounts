<script lang="ts">
  import { onMount } from 'svelte'
  import { authStore } from '../stores/auth'

  interface Props {
    component: any
    params?: Record<string, string>
  }

  let { component }: Props = $props()
  let isAuthenticated = $state(false)
  let isLoaded = $state(false)

  onMount(() => {
    const unsubscribe = authStore.subscribe((state) => {
      isAuthenticated = state.isAuthenticated
      isLoaded = true

      // If not authenticated, redirect to home
      if (!isAuthenticated) {
        window.location.hash = '#/'
      }
    })

    return unsubscribe
  })
</script>

{#if isLoaded && isAuthenticated}
  {@render component.render()}
{/if}
