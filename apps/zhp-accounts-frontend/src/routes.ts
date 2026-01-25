import Home from '@/routes/Home.svelte'
import Units from '@/routes/Units.svelte'
import Members from '@/routes/Members.svelte'
import Profile from '@/routes/Profile.svelte'
import type { RouteDefinition } from 'svelte-spa-router'
import type { ComponentType } from 'svelte'

export const routes: RouteDefinition = {
  '/': Home as unknown as ComponentType,
  '/units': Units as unknown as ComponentType,
  '/units/:id/members': Members as unknown as ComponentType,
  '/profile': Profile as unknown as ComponentType,
  '*': Home as unknown as ComponentType // Fallback to home
}
