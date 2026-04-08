import {
  AzureCliCredential,
  ChainedTokenCredential,
  DeviceCodeCredential,
  type DeviceCodeInfo,
  InteractiveBrowserCredential,
  ManagedIdentityCredential,
  type TokenCredential,
} from "@azure/identity";
import { config } from "@/config";

function formatAuthError(error: unknown): Record<string, unknown> {
  if (!(error instanceof Error)) {
    return { raw: String(error) };
  }

  const details: Record<string, unknown> = {
    name: error.name,
    message: error.message,
  };

  const maybeCode = (error as { code?: unknown }).code;
  if (typeof maybeCode === "string" || typeof maybeCode === "number") {
    details.code = maybeCode;
  }

  const maybeStatus = (error as { statusCode?: unknown }).statusCode;
  if (typeof maybeStatus === "number") {
    details.statusCode = maybeStatus;
  }

  return details;
}

class LoggingTokenCredential implements TokenCredential {
  constructor(
    private readonly name: string,
    private readonly inner: TokenCredential,
  ) {}

  async getToken(
    scopes: string | string[],
    options?: Parameters<TokenCredential["getToken"]>[1],
  ): ReturnType<TokenCredential["getToken"]> {
    console.info("[Azure Auth] Proba pobrania tokenu", {
      credential: this.name,
      scopes,
      nodeEnv: config.nodeEnv,
    });

    try {
      const token = await this.inner.getToken(scopes, options);
      if (token) {
        console.info("[Azure Auth] Token pobrany", {
          credential: this.name,
          expiresOnTimestamp: token.expiresOnTimestamp,
        });
      } else {
        console.warn("[Azure Auth] Brak tokenu (null)", {
          credential: this.name,
        });
      }

      return token;
    } catch (error) {
      console.error("[Azure Auth] Blad pobrania tokenu", {
        credential: this.name,
        ...formatAuthError(error),
      });

      throw error;
    }
  }
}

function createDevelopmentCredential(): TokenCredential {
  const tenantId = config.entraTenantId;
  const clientId = config.entraClientId;

  const azureCliCredential = new AzureCliCredential({
    tenantId,
  });

  const interactiveCredential = new InteractiveBrowserCredential({
    tenantId,
    clientId,
    redirectUri: "http://localhost:8400",
  });

  const deviceCodeCredential = new DeviceCodeCredential({
    tenantId,
    clientId,
    userPromptCallback: (deviceCodeInfo: DeviceCodeInfo): void => {
      console.info("Niedostepne uwierzytelnianie przez Azure CLI/przegladarke. Uzyj logowania za pomoca kodu urzadzenia:", {
        verificationUri: deviceCodeInfo.verificationUri,
        userCode: deviceCodeInfo.userCode,
        message: deviceCodeInfo.message,
      });
    },
  });

  return new ChainedTokenCredential(
    new LoggingTokenCredential("AzureCliCredential", azureCliCredential),
    new LoggingTokenCredential("InteractiveBrowserCredential", interactiveCredential),
    new LoggingTokenCredential("DeviceCodeCredential", deviceCodeCredential),
  );
}

function createCredential(): TokenCredential {
  if (config.nodeEnv === "development") {
    console.info("[Azure Auth] Uzywam ChainedTokenCredential dla lokalnego development", {
      chain: ["AzureCliCredential", "InteractiveBrowserCredential", "DeviceCodeCredential"],
    });
    return createDevelopmentCredential();
  }

  console.info("[Azure Auth] Uzywam ManagedIdentityCredential", {
    nodeEnv: config.nodeEnv,
  });
  return new LoggingTokenCredential("ManagedIdentityCredential", new ManagedIdentityCredential());
}

const credentialSingleton = createCredential();

export function getAzureTokenCredential(): TokenCredential {
  return credentialSingleton;
}
