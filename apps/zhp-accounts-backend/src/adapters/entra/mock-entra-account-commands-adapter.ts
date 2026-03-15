import type {
  CreateAccountResponse,
  GenerateTapResponse,
  ZhpMember,
} from "zhp-accounts-types";
import type { EntraAccountCommandsPort } from "@/ports/entra-account-commands-port";

export class MockEntraAccountCommandsAdapter implements EntraAccountCommandsPort {
  async createAccount(accountOwner: ZhpMember): Promise<CreateAccountResponse> {
    const localPart = `${accountOwner.name}.${accountOwner.surname}`.toLowerCase().replace(/\s+/g, ".");

    return {
      email: `${localPart}@example.zhp.pl`,
      password: "TempPassword123!",
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
