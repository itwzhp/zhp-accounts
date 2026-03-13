<script lang="ts">
  import { onMount } from "svelte";
  import { getAuthAdapter, getBackendAdapter } from "@/lib/adapters";
    import { UnauthenticatedError } from "@/lib/errors";
  import type { ZhpMemberDetails } from "zhp-accounts-types";
  import {
    ShieldAlert,
    KeyRound,
    MailPlus,
    Mail,
    IdCardLanyard
  } from "lucide-svelte";
  import CreateAccountModal from "@/lib/components/CreateAccountModal.svelte";
  import GenerateTapModal from "@/lib/components/GenerateTapModal.svelte";
  import PageHeader from "@/lib/components/PageHeader.svelte";
  import CopyButton from "@/lib/components/CopyButton.svelte";

  export let params: { unitId: string; memberId: string } = {
    unitId: "",
    memberId: "",
  };

  let member: ZhpMemberDetails | null = null;
  let loading = true;
  let error: string | null = null;

  type ModalState = "closed" | "create-account" | "generate-tap";

  let modalState: ModalState = "closed";

  $: unitId = parseInt(params.unitId, 10);
  $: memberId = params.memberId;

  onMount(async () => {
    try {
      const authAdapter = getAuthAdapter();
      const authStatus = await authAdapter.getAuthenticationStatus();
      if (!authStatus) {
        window.location.hash = "#/";
        return;
      }
      const backend = getBackendAdapter();
      member = await backend.getMember(memberId);
      if (!member) {
        error = "Nie znaleziono członka";
      }
    } catch (e) {
      if (e instanceof UnauthenticatedError) {
        window.location.hash = "#/";
        return;
      }
      error = e instanceof Error ? e.message : "Błąd ładowania danych";
    } finally {
      loading = false;
    }
  });

  async function handleCreateEmail() {
    modalState = "create-account";
  }

  function closeModal() {
    modalState = "closed";
  }

  async function refreshMemberData() {
    try {
      const backend = getBackendAdapter();
      const updatedMember = await backend.getMember(memberId);
      if (updatedMember) {
        member = updatedMember;
      }
    } catch (e) {
      console.error("Failed to refresh member data:", e);
    }
  }

  async function handleAccessReset() {
    modalState = "generate-tap";
  }
</script>

<svelte:head>
  <title
    >Konto ZHP | {member
      ? `${member.name} ${member.surname}`
      : "Członek"}</title
  >
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <PageHeader
    title="{member?.name} {member?.surname}"
    showBackButton={true}
    fallbackUrl="#/units/{unitId}/members"
    {loading}
  />
  {#if loading}
    <div class="text-center py-12">
      <div class="placeholder-circle w-12 h-12 mx-auto animate-pulse"></div>
      <p class="mt-4 text-surface-500-400-token">Ładowanie danych...</p>
    </div>
  {:else if error}
    <div class="alert variant-filled-error">
      <p>{error}</p>
    </div>
  {:else if member}
    <div class="space-y-6">
      <div class="card">
        <div class="flex items-start gap-4">
          <div class="flex-1">
            <div class="space-y-4">

              <p class="text-surface-600-300-token mb-2">
                <IdCardLanyard class="w-5 h-5 inline-block mr-3 -mt-1" />{member.membershipNumber}
                <CopyButton text={member.membershipNumber} />
              </p>
              <p class="text-surface-600-300-token mb-2">
                <Mail class="w-5 h-5 inline-block mr-3 -mt-0.5" />{member.mail ?? "Brak konta email"}
                {#if member.mail}<CopyButton text={member.mail}/>{/if}
              </p>

              {#if member.mail === null}
                <button
                  onclick={handleCreateEmail}
                  class="btn variant-filled-primary items-center gap-2 text-blue hover:underline mt-5"
                >
                  <MailPlus class="w-4 h-4" />
                  Utwórz konto
                </button>
              {:else if member.isAdmin}
                <div class="alert variant-filled-warning">
                  <div class="flex items-start gap-3">
                    <ShieldAlert class="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p class="font-semibold mb-1">Konto administracyjne</p>
                      <p class="">
                        To konto ma uprawnienia administracyjne. <br /> W przypadku
                        problemów technicznych skontaktuj się z Wydziałem IT.
                      </p>
                    </div>
                  </div>
                </div>
              {:else}
                <div class="flex flex-col items-start gap-1 mt-6">
                  <button
                    onclick={handleAccessReset}
                    class="btn variant-filled flex gap-2 text-blue hover:underline"
                  >
                    <KeyRound class="w-4 h-4" />
                    Reset dostępu
                  </button>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

{#if member}
  <CreateAccountModal
    isOpen={modalState === "create-account"}
    {member}
    onClose={closeModal}
    onSuccess={refreshMemberData}
  />
  <GenerateTapModal
    isOpen={modalState === "generate-tap"}
    {member}
    onClose={closeModal}
  />
{/if}
