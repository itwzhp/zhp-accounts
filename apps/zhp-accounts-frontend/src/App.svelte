<script lang="ts">
  import Router from 'svelte-spa-router'
  import { onMount } from 'svelte'
  import { Users, LogOut } from 'lucide-svelte'
  import { routes } from './routes'
  import { authStore } from './lib/stores/auth'

  let authState = $state({
    isAuthenticated: false,
    userName: null as string | null,
    isLoading: false,
  })

  onMount(() => {
    // Initialize auth state from stored session
    const unsubscribe = authStore.subscribe((state) => {
      authState.isAuthenticated = state.isAuthenticated
      authState.userName = state.userName ?? null
      authState.isLoading = state.isLoading
    })

    authStore.init()

    return unsubscribe
  })

  async function handleLogin() {
    const success = await authStore.login()
    if (success) {
      // Navigate to Units page
      window.location.hash = '#/units'
    }
  }

  async function handleLogout() {
    const success = await authStore.logout()
    if (success) {
      // Navigate to Home page
      window.location.hash = '#/'
    }
  }
</script>

<div class="min-h-screen bg-surface-50-900-token">
  <header class="py-8 relative">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- TODO test the mobile version -->
      <!-- Mobile Layout: Logo & Button on top, Title below -->
      <div class="md:hidden space-y-4">
        <div class="flex items-center justify-between gap-4">
          <a href="https://zhp.pl" class="flex-shrink-0">
            <img
              src="/images/identyfikatorZHP-zielony.svg"
              alt="ZHP"
              class="h-16 w-auto"
            />
          </a>

          <div>
            {#if authState.isAuthenticated && authState.userName}
              <div class="flex flex-col items-start gap-2">
                <span class="text-sm md:text-base font-medium">{authState.userName}</span>
                <button
                  onclick={handleLogout}
                  disabled={authState.isLoading}
                  class="flex items-center gap-1 text-sm text-zhp-blue hover:text-zhp-blue-light transition disabled:opacity-50"
                >
                  <LogOut size={18} />
                  <span class="hidden sm:inline">Wyloguj</span>
                </button>
              </div>
            {:else}
              <button
                onclick={handleLogin}
                disabled={authState.isLoading}
                class="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium text-sm md:text-base disabled:opacity-50 bg-primary hover:bg-primary-dark transition-colors"
              >
                <Users size={20} />
                <span>Zarządzaj</span>
              </button>
            {/if}
          </div>
        </div>

        <div class="header-title text-3xl font-semibold">
          Konta ZHP
        </div>
      </div>

      <!-- Desktop Layout: Title left, Logo centered, Button right -->
      <div class="hidden md:flex items-center justify-between">
        <div class="header-title text-4xl font-semibold">
          Konta ZHP
        </div>

        <a href="https://zhp.pl" class="absolute left-1/2 transform -translate-x-1/2">
          <img
            src="/images/identyfikatorZHP-zielony.svg"
            alt="ZHP"
            class="h-16 w-auto"
          />
        </a>

        <div>
          {#if authState.isAuthenticated && authState.userName}
            <div class="flex flex-col items-start gap-2">
              <span class="text-sm md:text-base font-medium">{authState.userName}</span>
              <button
                onclick={handleLogout}
                disabled={authState.isLoading}
                class="flex items-center gap-1 text-sm text-zhp-blue hover:text-zhp-blue-light transition disabled:opacity-50"
              >
                <LogOut size={18} />
                <span class="hidden sm:inline">Wyloguj</span>
              </button>
            </div>
          {:else}
            <button
              onclick={handleLogin}
              disabled={authState.isLoading}
              class="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium text-sm md:text-base disabled:opacity-50 bg-primary hover:bg-primary-dark transition-colors"
            >
              <Users size={20} />
              <span>Zarządzaj</span>
            </button>
          {/if}
        </div>
      </div>
    </div>
  </header>

  <Router {routes} />
</div>

<style>
</style>
