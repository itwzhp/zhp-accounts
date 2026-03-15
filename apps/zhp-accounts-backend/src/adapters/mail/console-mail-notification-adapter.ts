import type { CreateAccountResponse, GenerateTapResponse } from "zhp-accounts-types";
import type { MailNotificationPort } from "@/ports/mail-notification-port";

export class ConsoleMailNotificationAdapter implements MailNotificationPort {
  async notifyAboutCreatedAccount(notificationEmail: string, accountData: CreateAccountResponse): Promise<void> {
    console.info("[MailNotification] notifyAboutCreatedAccount", {
      notificationEmail,
      accountData,
    });
  }

  async notifyAboutGeneratedTap(notificationEmail: string, tapData: GenerateTapResponse): Promise<void> {
    console.info("[MailNotification] notifyAboutGeneratedTap", {
      notificationEmail,
      tapData,
    });
  }
}
