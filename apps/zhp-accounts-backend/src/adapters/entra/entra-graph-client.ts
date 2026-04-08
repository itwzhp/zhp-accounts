import { TokenCredentialAuthenticationProvider } from
    "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js";
import { Client } from "@microsoft/microsoft-graph-client";
import { config } from "@/config";
import { getAzureTokenCredential } from "@/frameworks/providers/azure-token-credential-provider";

const MANAGED_IDENTITY_SCOPE = ["https://graph.microsoft.com/.default"];
const DELEGATED_SCOPES = [
    "https://graph.microsoft.com/User.ReadWrite.All",
    "https://graph.microsoft.com/UserAuthenticationMethod.ReadWrite.All",
    "https://graph.microsoft.com/RoleManagement.Read.Directory",
];

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

const credentialSingleton = getAzureTokenCredential();
const graphClientSingleton = createGraphClient();

export function getGraphClient(): Client {
    return graphClientSingleton;
}
