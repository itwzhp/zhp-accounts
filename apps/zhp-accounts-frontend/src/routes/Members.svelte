<script lang="ts">
  import { onMount } from 'svelte'
  import { getAuthAdapter, getBackendAdapter } from '@/lib/adapters'
  import type { ZhpMember, ZhpUnit } from 'zhp-accounts-types'
  import { Users, ArrowLeft, UserCog } from 'lucide-svelte'

  export let params: { id: string } = { id: '' }

  let unit: ZhpUnit | null = null
  let members: ZhpMember[] = []
  let loading = true
  let error: string | null = null

  $: unitId = parseInt(params.id, 10)

  function handleBack() {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.history.replaceState(null, '', `#/units/${unitId}`)
    }
  }

  onMount(async () => {
    try {
      const authAdapter = getAuthAdapter()
      const isAuthenticated = await authAdapter.isAuthenticated()
      if (!isAuthenticated) {
        window.location.hash = '#/'
        return
      }
      const backend = getBackendAdapter()
      const result = await backend.getMembers(unitId)
      unit = result.unit
      members = result.members
    } catch (e) {
      error = e instanceof Error ? e.message : 'Błąd ładowania danych'
    } finally {
      loading = false
    }
  })
</script>

<svelte:head>
  <title>Konta ZHP | {unit ? `${unit.name}` : 'Członkowie'}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">


  <header class="mb-8  flex items-center gap-1">
    <button
    onclick={handleBack}
    class="btn btn-icon variant-soft-secondary hover:variant-filled-secondary transition-colors text-blue hover:text-blue-light"
    title="Wróć do poprzedniej strony"
    >
      <ArrowLeft class="w-6 h-6" />

    </button>
    <h1 class="text-3xl font-bold mb-2">
      {#if loading}
        <span class="placeholder w-48 animate-pulse"></span>
      {:else if unit}
        {unit.name}
      {/if}
    </h1>
  </header>

  {#if loading}
    <div class="text-center py-12">
      <div class="placeholder-circle w-12 h-12 mx-auto animate-pulse"></div>
      <p class="mt-4 text-surface-500-400-token">Ładowanie członków...</p>
    </div>
  {:else if error}
    <div class="alert variant-filled-error">
      <p>{error}</p>
    </div>
  {:else if members.length === 0}
    <div class="text-center py-12">
      <Users class="w-12 h-12 mx-auto text-surface-400" />
      <p class="mt-4 text-surface-500-400-token">
        Brak członków w tej jednostce
      </p>
    </div>
  {:else}
    <div class="table-container">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Imię i nazwisko</th>
            <th>Nr ewidencyjny</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each members as member (member.membershipNumber)}
            <tr>
              <td class="font-medium">{member.name} {member.surname}</td>
              <td>{member.membershipNumber}</td>
              <td><a href="#/units/{unitId}/members/{member.membershipNumber}" class="underline text-blue"><UserCog class="w-4 h-4 inline-block mr-2" />Zarządzaj</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
