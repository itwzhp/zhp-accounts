import { EmailClient, type EmailMessage } from "@azure/communication-email";
import type { CreateAccountResponse, GenerateTapResponse } from "zhp-accounts-types";
import { config } from "@/config";
import { getAzureTokenCredential } from "@/frameworks/providers/azure-token-credential-provider";
import type { MailNotificationPort } from "@/ports/mail-notification-port";

function getEnvironmentSubjectPrefix(): string {
  if (config.nodeEnv === "production") {
    return "";
  }

  const env = config.nodeEnv === "development" ? "DEV" : "TEST";
  return `[${env}] `;
}

function buildSubject(baseSubject: string): string {
  return `${getEnvironmentSubjectPrefix()}${baseSubject}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<li>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function getCreatedAccountHtml(accountData: CreateAccountResponse): string {
  return `
    <p>Twoje konto Microsoft 365 zostalo utworzone.</p>
    <p><strong>Adres konta:</strong> ${escapeHtml(accountData.account.upn)}<br/>
    <strong>Numer czlonkowski:</strong> ${escapeHtml(accountData.account.membershipNumber)}<br/>
    <strong>Haslo tymczasowe:</strong> ${escapeHtml(accountData.password)}</p>
    <p>Po pierwszym logowaniu zmien haslo.</p>
  `;
}

function getGeneratedTapHtml(tapData: GenerateTapResponse): string {
  return `
    <p>Wygenerowano nowy Temporary Access Pass (TAP).</p>
    <p><strong>TAP:</strong> ${escapeHtml(tapData.tap)}<br/>
    <strong>Wazny do:</strong> ${escapeHtml(tapData.expiresAt)}</p>
    <p>Wykorzystaj kod przed uplywem terminu waznosci.</p>
  `;
}

function buildAccountMessage(notificationEmail: string, accountData: CreateAccountResponse): EmailMessage {
  const html = getCreatedAccountHtml(accountData);
  return {
    senderAddress: config.mailFromAddress,
    recipients: {
      to: [{ address: notificationEmail }],
    },
    content: {
      subject: buildSubject("Twoje haslo do konta Microsoft 365"),
      html,
      plainText: htmlToPlainText(html),
    },
  };
}

function buildTapMessage(notificationEmail: string, tapData: GenerateTapResponse): EmailMessage {
  const html = getGeneratedTapHtml(tapData);
  return {
    senderAddress: config.mailFromAddress,
    recipients: {
      to: [{ address: notificationEmail }],
    },
    content: {
      subject: buildSubject("Twoj Temporary Access Pass (TAP)"),
      html,
      plainText: htmlToPlainText(html),
    },
  };
}

export class AzureMailNotificationAdapter implements MailNotificationPort {
  private readonly client: EmailClient;

  constructor() {
    this.client = new EmailClient(config.mailAcsEndpoint, getAzureTokenCredential());
  }

  async notifyAboutCreatedAccount(
    notificationEmail: string,
    accountData: CreateAccountResponse,
  ): Promise<void> {
    await this.send(buildAccountMessage(notificationEmail, accountData));
  }

  async notifyAboutGeneratedTap(
    notificationEmail: string,
    tapData: GenerateTapResponse,
  ): Promise<void> {
    await this.send(buildTapMessage(notificationEmail, tapData));
  }

  private async send(message: EmailMessage): Promise<void> {
    const poller = await this.client.beginSend(message);
    await poller.poll();

    const opState = poller.getOperationState();
    const operationId = opState.result?.id ?? "unknown";

    console.info("[Mail] ACS operation enqueued", {
      operationId,
      recipient: message.recipients.to?.[0]?.address,
      subject: message.content.subject,
    });

    // Fire-and-forget: poller continues in background via event loop
  }
}
