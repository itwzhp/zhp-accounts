import Home from '@/routes/Home.svelte'
import Units from '@/routes/Units.svelte'
import Members from '@/routes/Members.svelte'
import MemberDetails from '@/routes/MemberDetails.svelte'
import type { RouteDefinition } from 'svelte-spa-router'
import type { SvelteComponent } from 'svelte'

export const routes: RouteDefinition = {
  '/': Home as unknown as typeof SvelteComponent,
  '/units/:id': Units as unknown as typeof SvelteComponent,
  '/units': Units as unknown as typeof SvelteComponent,
  '/units/:unitId/members/:memberId': MemberDetails as unknown as typeof SvelteComponent,
  '/units/:id/members': Members as typeof SvelteComponent,
  '*': Home as unknown as typeof SvelteComponent // Fallback to home
}
