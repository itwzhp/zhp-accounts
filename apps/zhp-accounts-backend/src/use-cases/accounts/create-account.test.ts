import { afterEach, describe, expect, it, vi } from "vitest";
import type { Account } from "zhp-accounts-types";
import { createAccount } from "@/use-cases/accounts/create-account";
import * as serviceProvider from "@/frameworks/providers/service-provider";
import type { CreateAccountResult } from "@/ports/entra-account-commands-port";
import type { TipiMemberDetails } from "@/entities/tipi-member-details";

const ACTOR: Account = {
  id: "actor-1",
  upn: "admin@zhp.pl",
  membershipNumber: "AA000001"
};

const MEMBER: TipiMemberDetails = {
  name: "Jan",
  surname: "Kowalski",
  membershipNumber: "AA001234",
  hasAllRequiredConsents: true,
  hufiec: "Hufiec Warszawa-Mokotów",
  choragiew: "Chorągiew Stołeczna",
};

describe("createAccount", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws when account already exists for membership number", async () => {
    const getMember = vi.fn().mockResolvedValue(MEMBER);
    const createEntraAccount = vi.fn();

    vi.spyOn(serviceProvider, "getTipiQueryPort").mockReturnValue({
      getRootUnits: vi.fn(),
      getUnit: vi.fn(),
      getSubUnits: vi.fn(),
      getMembers: vi.fn(),
      getMember,
    });

    vi.spyOn(serviceProvider, "getEntraMemberDetailsPort").mockReturnValue({
      getMemberDetails: vi.fn().mockResolvedValue({
        id: "existing-1",
        upn: "jan.kowalski@zhp.pl",
        membershipNumber: MEMBER.membershipNumber,
        isAdmin: false,
      }),
    });

    vi.spyOn(serviceProvider, "getEntraAccountCommandsPort").mockReturnValue({
      createAccount: createEntraAccount,
      generateTap: vi.fn(),
    });

    vi.spyOn(serviceProvider, "getMailNotificationPort").mockReturnValue({
      notifyAboutCreatedAccount: vi.fn(),
      notifyAboutGeneratedTap: vi.fn(),
    });

    vi.spyOn(serviceProvider, "getAuditLoggerPort").mockReturnValue({
      log: vi.fn(),
    });

    await expect(
      createAccount({ membershipNumber: MEMBER.membershipNumber }, ACTOR),
    ).rejects.toThrow("już istnieje");

    expect(getMember).toHaveBeenCalledOnce();
    expect(createEntraAccount).not.toHaveBeenCalled();
  });

  it("retries next address pattern when previous one already exists", async () => {
    const createEntraAccount = vi.fn<
      (member: TipiMemberDetails, upn: string) => Promise<CreateAccountResult>
    >();

    createEntraAccount
      .mockResolvedValueOnce({ status: "already-exists", upn: "jan.kowalski@zhp.pl" })
      .mockResolvedValueOnce({ status: "already-exists", upn: "kowalski.jan@zhp.pl" })
      .mockResolvedValueOnce({
        status: "created",
        response: {
          password: "TempPassword123!",
          account: {
            id: "mock-1",
            upn: "j.kowalski@zhp.pl",
            membershipNumber: MEMBER.membershipNumber,
            isAdmin: false,
          },
        },
      });

    const notifyAboutCreatedAccount = vi.fn();
    const auditLog = vi.fn();

    vi.spyOn(serviceProvider, "getTipiQueryPort").mockReturnValue({
      getRootUnits: vi.fn(),
      getUnit: vi.fn(),
      getSubUnits: vi.fn(),
      getMembers: vi.fn(),
      getMember: vi.fn().mockResolvedValue(MEMBER),
    });

    vi.spyOn(serviceProvider, "getEntraMemberDetailsPort").mockReturnValue({
      getMemberDetails: vi.fn().mockResolvedValue(null),
    });

    vi.spyOn(serviceProvider, "getEntraAccountCommandsPort").mockReturnValue({
      createAccount: createEntraAccount,
      generateTap: vi.fn(),
    });

    vi.spyOn(serviceProvider, "getMailNotificationPort").mockReturnValue({
      notifyAboutCreatedAccount,
      notifyAboutGeneratedTap: vi.fn(),
    });

    vi.spyOn(serviceProvider, "getAuditLoggerPort").mockReturnValue({
      log: auditLog,
    });

    const result = await createAccount(
      {
        membershipNumber: MEMBER.membershipNumber,
        notificationEmail: "powiadomienia@zhp.pl",
      },
      ACTOR,
    );

    expect(createEntraAccount).toHaveBeenNthCalledWith(1, MEMBER, "jan.kowalski@zhp.pl");
    expect(createEntraAccount).toHaveBeenNthCalledWith(2, MEMBER, "kowalski.jan@zhp.pl");
    expect(createEntraAccount).toHaveBeenNthCalledWith(3, MEMBER, "j.kowalski@zhp.pl");
    expect(result.account.upn).toBe("j.kowalski@zhp.pl");
    expect(notifyAboutCreatedAccount).toHaveBeenCalledOnce();
    expect(auditLog).toHaveBeenCalledOnce();
  });
});
