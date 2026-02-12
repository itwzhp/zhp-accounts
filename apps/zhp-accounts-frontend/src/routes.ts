import Home from '@/routes/Home.svelte'
import UnitsProtected from '@/routes/UnitsProtected.svelte'
import MembersProtected from '@/routes/MembersProtected.svelte'
import type { RouteDefinition } from 'svelte-spa-router'
import type { SvelteComponent } from 'svelte'

export const routes: RouteDefinition = {
  '/': Home as unknown as typeof SvelteComponent,
  '/units': UnitsProtected as unknown as typeof SvelteComponent,
  '/units/:id/members': MembersProtected as unknown as typeof SvelteComponent,
  '*': Home as unknown as typeof SvelteComponent // Fallback to home
}
