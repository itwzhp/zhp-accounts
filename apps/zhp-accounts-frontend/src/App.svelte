<script lang="ts">
  import Router from 'svelte-spa-router'
  import { onMount } from 'svelte'
  import { Users, LogOut } from 'lucide-svelte'
  import { routes } from './routes'
  import { getAuthAdapter } from './lib/adapters'
  import { link } from 'svelte-spa-router'

  let authState = $state({
    isAuthenticated: false,
    userName: null as string | null,
    isLoading: false,
  })

  onMount(async () => {
    authState.isLoading = true
    try {
      const authAdapter = getAuthAdapter()
      authState.isAuthenticated = await authAdapter.isAuthenticated()
    } finally {
      authState.isLoading = false
    }
  })

  async function handleLogin() {
    authState.isLoading = true
    try {
      const authAdapter = getAuthAdapter()
      const result = await authAdapter.login()
      if (result) {
        authState.isAuthenticated = true
        authState.userName = result.userName
        window.location.hash = '#/units'
      }
    } finally {
      authState.isLoading = false
    }
  }

  async function handleLogout() {
    authState.isLoading = true
    try {
      const authAdapter = getAuthAdapter()
      await authAdapter.logout()
      authState.isAuthenticated = false
      authState.userName = null
      window.location.hash = '#/'
    } finally {
      authState.isLoading = false
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
        <a href="#/" use:link>
        <div class="header-title text-4xl font-semibold">
          Konta ZHP
        </div>
        </a>

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
