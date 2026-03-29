import {
    DeviceCodeCredential,
    type DeviceCodeInfo,
    InteractiveBrowserCredential,
    ManagedIdentityCredential,
    TokenCredential,
} from "@azure/identity";
import { TokenCredentialAuthenticationProvider } from
    "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js";
import { Client } from "@microsoft/microsoft-graph-client";
import { config } from "@/config";

const MANAGED_IDENTITY_SCOPE = ["https://graph.microsoft.com/.default"];
const DELEGATED_SCOPES = [
    "https://graph.microsoft.com/User.ReadWrite.All",
    "https://graph.microsoft.com/UserAuthenticationMethod.ReadWrite.All",
    "https://graph.microsoft.com/RoleManagement.Read.Directory",
];

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
        console.info("[Entra Auth] Proba pobrania tokenu", {
            credential: this.name,
            scopes,
            nodeEnv: config.nodeEnv,
        });

        try {
            const token = await this.inner.getToken(scopes, options);
            if (token) {
                console.info("[Entra Auth] Token pobrany", {
                    credential: this.name,
                    expiresOnTimestamp: token.expiresOnTimestamp,
                });
            } else {
                console.warn("[Entra Auth] Brak tokenu (null)", {
                    credential: this.name,
                });
            }

            return token;
        } catch (error) {
            console.error("[Entra Auth] Blad pobrania tokenu", {
                credential: this.name,
                ...formatAuthError(error),
            });

            throw error;
        }
    }
}

function createCredential(): TokenCredential {
    if (config.nodeEnv !== "development") {
        console.info("[Entra Auth] Uzywam ManagedIdentityCredential", {
            nodeEnv: config.nodeEnv,
            scopes: MANAGED_IDENTITY_SCOPE,
        });
        return new ManagedIdentityCredential();
    }

    const tenantId = config.entraTenantId;
    const clientId = config.entraClientId;

    const interactiveCredential = new InteractiveBrowserCredential({
        tenantId,
        clientId,
        redirectUri: "http://localhost:8400",
    });

    const deviceCodeCredential = new DeviceCodeCredential({
        tenantId,
        clientId,
        userPromptCallback: (deviceCodeInfo: DeviceCodeInfo): void => {
            console.info("Niedostepne uwierzytelnianie przegladarki. Uzyj logowania za pomoca kodu urzadzenia:", {
                verificationUri: deviceCodeInfo.verificationUri,
                userCode: deviceCodeInfo.userCode,
                message: deviceCodeInfo.message,
            });
        },
    });

    const loggedInteractiveCredential = new LoggingTokenCredential(
        "InteractiveBrowserCredential",
        interactiveCredential,
    );

    const loggedDeviceCodeCredential = new LoggingTokenCredential(
        "DeviceCodeCredential",
        deviceCodeCredential,
    );

    return {
        async getToken(scopes, options) {
            try {
                return await loggedInteractiveCredential.getToken(scopes, options);
            } catch {
                console.warn("[Entra Auth] Fallback do DeviceCodeCredential po bledzie InteractiveBrowserCredential");
                return loggedDeviceCodeCredential.getToken(scopes, options);
            }
        },
    } satisfies TokenCredential;
}

function getScopes(): string[] {
    return config.nodeEnv === "development"
        ? DELEGATED_SCOPES
        : MANAGED_IDENTITY_SCOPE;
}

function createGraphClient(): Client {
    const scopes = getScopes();
    console.info("[Entra Graph] Inicjalizacja klienta", {
        nodeEnv: config.nodeEnv,
        scopes,
    });

    const tokenProvider = new TokenCredentialAuthenticationProvider(credentialSingleton, {
        scopes,
    });

    return Client.initWithMiddleware({ authProvider: tokenProvider });
}

const credentialSingleton = createCredential();
const graphClientSingleton = createGraphClient();

export function getGraphClient(): Client {
    return graphClientSingleton;
}
