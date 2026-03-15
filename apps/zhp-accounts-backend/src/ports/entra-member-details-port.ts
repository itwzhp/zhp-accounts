import type { EntraMember } from "@/entities/entra-member";

export interface EntraMemberDetailsPort {
  getMemberDetails(memberId: string): Promise<EntraMember | null>;
}