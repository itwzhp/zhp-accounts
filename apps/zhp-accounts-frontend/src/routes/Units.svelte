<script lang="ts">
  import { onMount } from 'svelte'
  import { getAuthAdapter, getBackendAdapter } from '@/lib/adapters'
  import type { ZhpUnit } from 'zhp-accounts-types'
  import { Building, Building2, ChevronsRight, Users } from 'lucide-svelte'
  import { link } from 'svelte-spa-router'
  import PageHeader from '@/lib/components/PageHeader.svelte'

  const { params = undefined } = $props<{ id?: string } | undefined>()

  let units = $state<ZhpUnit[]>([])
  let rootUnit = $state<ZhpUnit | null>(null)
  let loading = $state(true)
  let error = $state<string | null>(null)

  async function loadUnits(id : string | undefined) {
    try {
      loading = true
      const authAdapter = getAuthAdapter()
      const authStatus = await authAdapter.getAuthenticationStatus()
      if (!authStatus) {
        window.location.hash = '#/'
        return
      }
      const backend = getBackendAdapter()
      if (id && Number(id)) {
        const result = await backend.getSubUnits(Number(id))
        rootUnit = result.root
        units = result.subunits
      } else {
        rootUnit = null
        const result = await backend.getRootUnits()
        units = result.units
      }
    } catch (e) {
      error = e instanceof Error ? e.message : 'Błąd ładowania jednostek'
    } finally {
      loading = false
    }
  }

  onMount(() => {
    loadUnits(params?.id)
  })

  $effect(() => {
    loadUnits(params?.id)
  })
</script>

<svelte:head>
  <title>Konto ZHP | {rootUnit ? rootUnit.name : 'Jednostki'}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl space-y-5">
  <PageHeader 
    title={rootUnit?.name ?? 'Zarządzanie kontami'} 
    showBackButton={!!rootUnit}
    fallbackUrl="#/units"
    loading={loading}
  />

  {#if loading}
    <div class="text-center py-12">
      <div class="placeholder-circle w-12 h-12 mx-auto animate-pulse"></div>
      <p class="mt-4 text-surface-500-400-token">Ładowanie jednostek...</p>
    </div>
  {:else if error}
    <div class="alert variant-filled-error">
      <p>{error}</p>
    </div>
  {:else}
    {#if rootUnit}
      <div class="">
        <h2 class="text-xl">Członkowie</h2>
        <p class="text-surface-600-300-token">
          <a href="/units/{rootUnit.id}/members" use:link class="hover:underline text-blue">Zarządzaj kontami członków z przydziałem<ChevronsRight class="inline w-4 h-4 mx-1 text-surface-400-300-token" /> </a>
        </p>
      </div>
    {/if}
    {#if units.length !== 0}
    <div class="">
      {#if rootUnit}<h2 class="text-xl">Podjednostki</h2>{/if}
      <p class="text-surface-600-300-token mb-3">
        Oto lista jednostek, do których masz uprawnienia. Kliknij na jednostkę, aby zarządzać kontami członków.
      </p>
      {#each units as unit (unit.id)}
        <a
          href="/units/{unit.id}"
          use:link
          class="card p-4 flex items-center gap-4 hover:variant-soft-primary transition-colors hover:underline"
        >
          {#if unit.type === 'pjo'}
            <Users class="w-6 h-6 text-primary -mt-0.5" />
          {:else if unit.type === 'hufiec'}
            <Building class="w-6 h-6 text-primary -mt-0.5" />
          {:else}
            <Building2 class="w-6 h-6 text-primary -mt-1" />
          {/if}
          <div class="flex-1">
            <h3 class="font-semibold text-blue hover:text-blue-light">{unit.name}</h3>
          </div>
        </a>
      {/each}
    </div>
    {/if }
  {/if}
</div>
