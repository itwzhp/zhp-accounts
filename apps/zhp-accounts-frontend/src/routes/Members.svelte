<script lang="ts">
  import { onMount } from 'svelte'
  import { getAuthAdapter, getBackendAdapter } from '@/lib/adapters'
    import { UnauthenticatedError } from '@/lib/errors'
  import type { ZhpMember, ZhpUnit } from 'zhp-accounts-types'
  import { Users, User, UserCog } from 'lucide-svelte'
  import PageHeader from '@/lib/components/PageHeader.svelte'

  export let params: { id: string } = { id: '' }

  let unit: ZhpUnit | null = null
  let members: ZhpMember[] = []
  let loading = true
  let error: string | null = null

  $: unitId = parseInt(params.id, 10)

  onMount(async () => {
    try {
      const authAdapter = getAuthAdapter()
      const authStatus = await authAdapter.getAuthenticationStatus()
      if (!authStatus) {
        window.location.hash = '#/'
        return
      }
      const backend = getBackendAdapter()
      const result = await backend.getMembers(unitId)
      unit = result.unit
      members = result.members
    } catch (e) {
      if (e instanceof UnauthenticatedError) {
        window.location.hash = '#/'
        return
      }
      error = e instanceof Error ? e.message : 'Błąd ładowania danych'
    } finally {
      loading = false
    }
  })
</script>

<svelte:head>
  <title>Konto ZHP | {unit ? `${unit.name}` : 'Członkowie'}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">

  <PageHeader 
    title={unit?.name ?? ''} 
    showBackButton={true}
    fallbackUrl="#/units/{unitId}"
    loading={loading}
  />

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
              <td class="font-medium"><User class="w-4 h-4 inline-block mr-2 -mt-1 text-primary-dark" />{member.name} {member.surname}</td>
              <td>{member.membershipNumber}</td>
              <td><a href="#/units/{unitId}/members/{member.membershipNumber}" class="hover:underline text-blue"><UserCog class="w-4 h-4 inline-block mr-2 -mt-1" />Zarządzaj</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
