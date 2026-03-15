import type { CreateAccountResponse, GenerateTapResponse } from "zhp-accounts-types";

export interface MailNotificationPort {
  notifyAboutCreatedAccount(notificationEmail: string, accountData: CreateAccountResponse): Promise<void>;
  notifyAboutGeneratedTap(notificationEmail: string, tapData: GenerateTapResponse): Promise<void>;
}
