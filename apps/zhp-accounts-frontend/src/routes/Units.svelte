<script lang="ts">
  import { onMount } from 'svelte'
  import { getBackendAdapter } from '@/lib/adapters'
  import type { ZhpUnit } from 'zhp-accounts-types'
  import { Building2 } from 'lucide-svelte'
  import { link } from 'svelte-spa-router'

  let units: ZhpUnit[] = []
  let loading = true
  let error: string | null = null

  onMount(async () => {
    try {
      const backend = getBackendAdapter()
      units = await backend.getUnits()
    } catch (e) {
      error = e instanceof Error ? e.message : 'Błąd ładowania jednostek'
    } finally {
      loading = false
    }
  })
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <header class="mb-8">
    <h1 class="text-3xl font-bold mb-2">Jednostki</h1>
    <p class="text-surface-600-300-token">
      Oto lista jednostek, do których masz uprawnienia. Kliknij na jednostkę, aby zarządzać kontami członków.
    </p>
  </header>

  {#if loading}
    <div class="text-center py-12">
      <div class="placeholder-circle w-12 h-12 mx-auto animate-pulse"></div>
      <p class="mt-4 text-surface-500-400-token">Ładowanie jednostek...</p>
    </div>
  {:else if error}
    <div class="alert variant-filled-error">
      <p>{error}</p>
    </div>
  {:else if units.length === 0}
    <div class="text-center py-12">
      <Building2 class="w-12 h-12 mx-auto text-surface-400" />
      <p class="mt-4 text-surface-500-400-token">
        Nie masz uprawnień do zarządzania kontami członków żadnej jednostki.
      </p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each units as unit (unit.id)}
        <a
          href="/units/{unit.id}/members"
          use:link
          class="card p-4 flex items-center gap-4 hover:variant-soft-primary transition-colors"
        >
          <Building2 class="w-6 h-6 text-primary-500" />
          <div class="flex-1">
            <h3 class="font-semibold">{unit.name}</h3>
            <p class="text-sm text-surface-500-400-token">
              {unit.type} • {unit.region ?? 'Brak regionu'}
            </p>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>
