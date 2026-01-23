import Home from '@/routes/Home.svelte'
import Units from '@/routes/Units.svelte'
import Members from '@/routes/Members.svelte'
import Profile from '@/routes/Profile.svelte'
import type { RouteDefinition } from 'svelte-spa-router'

export const routes: RouteDefinition = {
  '/': Home,
  '/units': Units,
  '/units/:id/members': Members,
  '/profile': Profile,
  '*': Home // Fallback to home
}
