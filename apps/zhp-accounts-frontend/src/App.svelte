<script lang="ts">
  import Router from 'svelte-spa-router'
  import { routes } from './routes'
</script>

<div class="min-h-screen bg-surface-50-900-token">
  <header class="py-8">
    <div class="container mx-auto px-4 max-w-6xl flex items-center justify-between">
      <div class="header-title text-3xl md:text-4xl font-semibold">
        Konta ZHP
      </div>
      <a href="https://zhp.pl" class="flex justify-end">
        <img
          src="/images/identyfikatorZHP-zielony.svg"
          alt="ZHP"
          class="h-16 w-auto"
        />
      </a>
    </div>
  </header>

  <Router {routes} />
</div>
