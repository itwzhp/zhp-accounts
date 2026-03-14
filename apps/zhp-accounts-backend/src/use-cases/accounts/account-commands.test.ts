import { describe, expect, it, vi } from "vitest";
import type {
  CreateAccountResponse,
  GenerateTapResponse,
} from "zhp-accounts-types";
import { createAccount } from "@/use-cases/accounts/create-account";
import { generateTap } from "@/use-cases/accounts/generate-tap";
import type { EntraAccountCommandsPort } from "@/use-cases/accounts/ports/entra-account-commands-port";

describe("account command use-cases", (): void => {
  it("passes membershipNumber and login to createAccount port method", async (): Promise<void> => {
    const createAccountResponse: CreateAccountResponse = {
      email: "al005047071@example.zhp.pl",
      password: "TempPassword123!",
    };

    const createAccountMock = vi
      .fn<(memberNum: string, login: string) => Promise<CreateAccountResponse>>()
      .mockResolvedValue(createAccountResponse);
    const generateTapMock = vi
      .fn<(memberNum: string, email: string, login: string) => Promise<GenerateTapResponse>>()
      .mockResolvedValue({
        tap: "tap",
        expiresAt: new Date().toISOString(),
      });

    const port: EntraAccountCommandsPort = {
      createAccount: createAccountMock,
      generateTap: generateTapMock,
    };

    const result = await createAccount(
      port,
      {
        membershipNumber: "AL005047071",
      },
      "karol.grodzicki@zhp.net.pl",
    );

    expect(result).toEqual(createAccountResponse);
    expect(createAccountMock).toHaveBeenCalledWith("AL005047071", "karol.grodzicki@zhp.net.pl");
  });

  it("passes membershipNumber, email and login to generateTap port method", async (): Promise<void> => {
    const createAccountMock = vi
      .fn<(memberNum: string, login: string) => Promise<CreateAccountResponse>>()
      .mockResolvedValue({
        email: "al005047071@example.zhp.pl",
        password: "TempPassword123!",
      });
    const generateTapResponse: GenerateTapResponse = {
      tap: "mock-temporary-access-pass-123456",
      expiresAt: "2026-03-14T12:00:00.000Z",
    };
    const generateTapMock = vi
      .fn<(memberNum: string, email: string, login: string) => Promise<GenerateTapResponse>>()
      .mockResolvedValue(generateTapResponse);

    const port: EntraAccountCommandsPort = {
      createAccount: createAccountMock,
      generateTap: generateTapMock,
    };

    const result = await generateTap(
      port,
      {
        membershipNumber: "AL005047071",
        email: "al005047071@example.zhp.pl",
      },
      "karol.grodzicki@zhp.net.pl",
    );

    expect(result).toEqual(generateTapResponse);
    expect(generateTapMock).toHaveBeenCalledWith(
      "AL005047071",
      "al005047071@example.zhp.pl",
      "karol.grodzicki@zhp.net.pl",
    );
  });
});