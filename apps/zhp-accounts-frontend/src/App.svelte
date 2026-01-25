<script lang="ts">
  import Router from 'svelte-spa-router'
  import { routes } from './routes'
</script>

<div class="min-h-screen bg-surface-50-900-token">
  <Router {routes} />
</div>
