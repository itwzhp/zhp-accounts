<script lang="ts">
  import { onMount } from 'svelte'
  import { getBackendAdapter } from '@/lib/adapters'
  import type { ZhpMember, ZhpUnit } from 'zhp-accounts-types'
  import { Users, Search, ArrowLeft } from 'lucide-svelte'
  import { link } from 'svelte-spa-router'

  export let params: { id: string } = { id: '' }

  let unit: ZhpUnit | null = null
  let members: ZhpMember[] = []
  let loading = true
  let error: string | null = null
  let searchQuery = ''

  $: unitId = parseInt(params.id, 10)
  $: filteredMembers = members.filter(member =>
    `${member.name} ${member.surname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.membershipNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  onMount(async () => {
    try {
      const backend = getBackendAdapter()
      const [unitData, membersData] = await Promise.all([
        backend.getUnit(unitId),
        backend.getMembers(unitId)
      ])
      unit = unitData
      members = membersData
    } catch (e) {
      error = e instanceof Error ? e.message : 'Błąd ładowania danych'
    } finally {
      loading = false
    }
  })
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <a href="/units" use:link class="inline-flex items-center gap-2 text-primary-500 hover:underline mb-4">
    <ArrowLeft class="w-4 h-4" />
    Powrót do jednostek
  </a>

  <header class="mb-8">
    <h1 class="text-3xl font-bold mb-2">
      {#if loading}
        <span class="placeholder w-48 animate-pulse"></span>
      {:else if unit}
        {unit.name}
      {:else}
        Jednostka nieznaleziona
      {/if}
    </h1>
    <p class="text-surface-600-300-token">
      Lista członków jednostki
    </p>
  </header>

  <!-- Search -->
  <div class="relative mb-6">
    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
    <input
      type="text"
      placeholder="Szukaj członka..."
      bind:value={searchQuery}
      class="input pl-10 w-full"
    />
  </div>

  {#if loading}
    <div class="text-center py-12">
      <div class="placeholder-circle w-12 h-12 mx-auto animate-pulse"></div>
      <p class="mt-4 text-surface-500-400-token">Ładowanie członków...</p>
    </div>
  {:else if error}
    <div class="alert variant-filled-error">
      <p>{error}</p>
    </div>
  {:else if filteredMembers.length === 0}
    <div class="text-center py-12">
      <Users class="w-12 h-12 mx-auto text-surface-400" />
      <p class="mt-4 text-surface-500-400-token">
        {searchQuery ? 'Nie znaleziono członków' : 'Brak członków w tej jednostce'}
      </p>
    </div>
  {:else}
    <div class="table-container">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Imię i nazwisko</th>
            <th>Nr ewidencyjny</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredMembers as member (member.id)}
            <tr>
              <td class="font-medium">{member.name} {member.surname}</td>
              <td>{member.membershipNumber}</td>
              <td>
                {#if member.personalMail}
                  <a href="mailto:{member.personalMail}" class="text-primary-500 hover:underline">
                    {member.personalMail}
                  </a>
                {:else}
                  <span class="text-surface-400">—</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
