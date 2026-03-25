import type {
  CreateAccountResponse,
  GenerateTapResponse,
  ZhpMember,
} from "zhp-accounts-types";
import type { EntraAccountCommandsPort } from "@/ports/entra-account-commands-port";

export class MockEntraAccountCommandsAdapter implements EntraAccountCommandsPort {
  async createAccount(accountOwner: ZhpMember): Promise<CreateAccountResponse> {
    const localPart = `${accountOwner.name}.${accountOwner.surname}`.toLowerCase().replace(/\s+/g, ".");
    const email = `${localPart}@example.zhp.pl`;

    return {
      password: "TempPassword123!",
      account: {
        id: `mock-${accountOwner.membershipNumber}`,
        upn: email,
        membershipNumber: accountOwner.membershipNumber,
        isAdmin: false,
      },
    };
  }

  async generateTap(memberNum: string): Promise<GenerateTapResponse> {
    const tapSuffix = Buffer.from(memberNum).toString("base64url").slice(0, 12);

    return {
      tap: `mock-tap-${tapSuffix}`,
      expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    };
  }
}
