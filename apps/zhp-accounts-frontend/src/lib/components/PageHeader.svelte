<script lang="ts">
    import { ArrowLeft } from "lucide-svelte";

    interface Props {
        title: string;
        showBackButton: boolean;
        loading: boolean;
        fallbackUrl?: string;
    }

    let { title, showBackButton, loading, fallbackUrl }: Props =
        $props();

    function handleBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else if (fallbackUrl) {
            window.history.replaceState(null, "", fallbackUrl);
        }
    }
</script>

<header class="mb-8 flex items-center gap-0.5">
    {#if showBackButton}
        <button
            onclick={handleBack}
            class="btn p-1 variant-soft-secondary hover:variant-filled-secondary transition-colors text-blue hover:text-blue-light"
            title="Wróć"
        >
            <ArrowLeft class="w-8 h-8 -mt-2" />
        </button>
    {/if}
    <h1 class="text-3xl font-bold mb-2">
        {#if loading}
            <span class="placeholder block w-48 animate-pulse h-10"></span>
        {:else}
            {title}
        {/if}
    </h1>
</header>
