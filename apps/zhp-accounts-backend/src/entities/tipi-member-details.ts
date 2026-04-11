import type { ZhpMember } from "zhp-accounts-types";

export interface TipiMemberDetails extends ZhpMember {
  hasAllRequiredConsents: boolean;
  hufiec: string;
  choragiew: string;
}