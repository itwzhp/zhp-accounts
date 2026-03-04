# Entra ID Authentication Setup Guide

This document explains how to set up your ZHP Accounts application to authenticate users via Microsoft Entra ID (Azure AD) using MSAL.js.

## Overview

The authentication system uses:
- **MSAL.js** for OAuth 2.0/OIDC authentication
- **Microsoft Entra ID** (Azure AD) as the identity provider
- **Redirect Flow** for reliable enterprise authentication
- **Session Storage** for token caching (cleared when tab closes)

## Implementation Details

### Architecture

```
RealAuthAdapter (real-auth.ts)
├── Uses PublicClientApplication from MSAL.js
├── Manages login/logout with redirect flow
├── Caches tokens in sessionStorage
└── Provides getToken() for backend API calls
```

### Authentication Flow

1. **User Login**: Click "Zaloguj" button → `RealAuthAdapter.login()` → Redirect to Microsoft login
2. **Microsoft Login**: User enters credentials → Microsoft Entra ID authenticates
3. **Redirect Back**: Returns to app with authorization code → `MSAL.js` exchanges for tokens
4. **Callback Handling**: `App.svelte` calls `handleRedirectCallback()` on mount
5. **Token Retrieval**: `getToken()` returns access token for backend API
6. **User Info**: User name extracted from token claims

### Token Management

- **Storage**: SessionStorage (cleared on tab close/browser restart)
- **Persistence**: Tokens survive page reloads within the same session
- **Refresh**: MSAL automatically refreshes tokens before expiry
- **Scopes**: `User.Read` (Microsoft Graph) + Backend API scope

## Configuration

### Prerequisites

You need an **Azure App Registration** with these details:
- Application (Client) ID
- Tenant ID
- Configured Redirect URI
- Configured Backend API scope

### Step 1: Create/Configure Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App Registrations** → **New Registration**
3. Fill in:
   - **Name**: "ZHP Accounts Frontend" (or your app name)
   - **Supported account types**: Choose based on your needs
     - "Accounts in this organizational directory only" - Single tenant
4. Click **Register**

### Step 2: Configure Redirect URI

1. In App Registration, go to **Authentication** → **Add a platform**
2. Choose **Single-page application (SPA)**
3. Add Redirect URI:
   - **Development**: `http://localhost:5173`
   - **Production**: `https://yourdomain.com`
4. Enable: **Access tokens** ✓ and **ID tokens** ✓
5. Click **Configure**

### Step 3: Create Backend API Scope

1. Go to **Expose an API**
2. If no scope is set, click "Set" next to **Application ID URI**
3. Use format: `api://YOUR_CLIENT_ID` (auto-generated)
4. Click **Add a scope**:
   - **Scope name**: `.default` (or custom like `access_as_user`)
   - **Admin consent display name**: "Access ZHP Backend"
   - **Admin consent description**: "Allows the app to access ZHP backend API"
5. Save

### Step 4: Set Environment Variables

**Local Development** (`.env.local`):

```env
VITE_MSAL_CLIENT_ID=YOUR_CLIENT_ID_HERE
VITE_MSAL_TENANT_ID=YOUR_TENANT_ID_HERE
VITE_MSAL_REDIRECT_URI=http://localhost:5173
VITE_MSAL_BACKEND_SCOPE=api://YOUR_BACKEND_CLIENT_ID/.default
VITE_API_BASE_URL=http://localhost:3000/api
```

**Production** (Set in your deployment environment):

```env
VITE_MSAL_CLIENT_ID=YOUR_PRODUCTION_CLIENT_ID
VITE_MSAL_TENANT_ID=YOUR_PRODUCTION_TENANT_ID
VITE_MSAL_REDIRECT_URI=https://yourdomain.com
VITE_MSAL_BACKEND_SCOPE=api://YOUR_BACKEND_CLIENT_ID/.default
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Step 5: Deploy Redirect URI to Backend

Ensure your backend API is configured to trust tokens from this Client ID and Tenant ID. See [Backend Integration](#backend-integration).

## Testing

### With Your Azure Tenant

```bash
pnpm dev  # Start dev server at http://localhost:5173
```

Navigate to **http://localhost:5173** (NOT with `?mock=true`)
- Click **Zaloguj** (Login)
- Redirected to Microsoft login
- Enter your work account credentials
- Redirected back to app
- User name displayed in header
- Click **Wyloguj** (Logout)

### With Mock Data (Testing without Azure)

```bash
pnpm dev
# Navigate to: http://localhost:5173?mock=true
```

The `MockAuthAdapter` is used. No Azure configuration needed.

## Troubleshooting

### "MSAL configuration missing" Error

**Cause**: Missing environment variables

**Fix**: 
1. Check `.env.local` exists with all required variables
2. Verify `VITE_MSAL_CLIENT_ID` and `VITE_MSAL_TENANT_ID` are set
3. Restart dev server: `pnpm dev`

### "Failed to fetch resource: 404" in Redirect URI

**Cause**: Redirect URI not configured in Azure App Registration

**Fix**:
1. Azure Portal → App Registration → Authentication
2. Add Redirect URI: `http://localhost:5173` (for dev)
3. Save and wait ~5 minutes

### User redirected to login repeatedly

**Cause**: Token not being cached properly

**Fix**:
1. Check browser allows sessionStorage (not in private mode)
2. DevTools → Application → Session Storage → Check for MSAL cookies
3. Verify redirect flow completed successfully

### Login button doesn't work

**Cause**: MSAL instance not initialized

**Fix**:
1. Open DevTools → Console
2. Check for MSAL initialization errors
3. Verify all env vars are set correctly

## Backend Integration

Once backend endpoints are ready to accept authentication, use `getToken()` in backend adapters:

```typescript
// In RealBackendAdapter (future implementation)
async getRootUnits(): Promise<ZhpUnit[]> {
  const authAdapter = getAuthAdapter()
  const token = await authAdapter.getToken()

  const response = await fetch(`${this.baseUrl}/units`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  // ...
}
```

**Backend Requirements**:
- Accept `Bearer` tokens in `Authorization` header
- Validate token issuer matches your Tenant ID
- Check token audience matches your Backend API scope
- Verify token signature using Azure AD public keys

## Migration Path

### Phase 1: Current (Just Completed)
- ✅ User authentication with Entra ID
- ✅ Token caching in sessionStorage
- ✅ Login/logout flows
- ⏳ Backend token injection (deferred)

### Phase 2: Future
- [X] Add token to backend API requests
- [ ] Implement token refresh on 401 responses
- [ ] Add token refresh timer as backup
- [ ] Centralized error handling for token errors

### Phase 3: Optional Enhancements
- [ ] SSO (Single Sign-On) when testing across apps
- [ ] Automatic redirect to login on 401 responses

## Security Notes

⚠️ **Important**:
- Never hardcode credentials in source code
- Use HTTPS in production (required by OAuth)
- sessionStorage is cleared on tab close (good)
- DO NOT use localStorage for sensitive tokens (would persist longer than session)

## Useful Links

- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Azure App Registration](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [OAuth 2.0 Authorization Code Flow](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
- [Token-based Authentication](https://learn.microsoft.com/en-us/azure/active-directory/develop/access-tokens)

## Support Files

- **msal-config.ts**: MSAL configuration and helper functions
- **real-auth.ts**: RealAuthAdapter implementation with MSAL.js
- **mock-auth.ts**: MockAuthAdapter for development testing
- **.env.example**: Template for environment variables
- **.env.local**: Local development configuration (not committed to git)
