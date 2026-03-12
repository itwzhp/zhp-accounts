# ZHP Accounts

Repozytorium zawiera frontend, backend i współdzielone typy dla aplikacji Konto ZHP.

## Struktura `apps`

- `apps/zhp-accounts-frontend` - frontend w Svelte + Vite, wdrażany jako Cloudflare Worker z assetami statycznymi.
- `apps/zhp-accounts-backend` - backend HTTP w Node.js + Express, budowany do obrazu Docker i wdrażany do Azure Container Apps.
- `apps/zhp-accounts-types` - współdzielone typy TypeScript używane przez frontend i backend.

## Adresy

### Lokalnie

- Frontend dev: http://localhost:5173
- Backend dev: http://localhost:3000

### Produkcja

- Frontend: https://konto.zhp.pl
- Backend: https://konto-backend.zhp.pl
- TMP Backend - https://zhp-accounts-frontend.zhp-gk.workers.dev - zanim nie włączymy głównego
  - potem należy usunąć go z CORS backendu oraz redirect url w entra ID frontu

## Uruchomienie lokalne

Opisane w Readme poszczególnych apek

## Postawienie środowiska od zera

### 1. Frontend

- Utwórz aplikację Cloudflare Worker.
- Podepnij domenę produkcyjną `konto.zhp.pl`.
- Ustaw zmienne środowiskowe frontendu, w szczególności:
  - `VITE_MSAL_CLIENT_ID`
  - `VITE_MSAL_TENANT_ID`
  - `VITE_MSAL_REDIRECT_URI`
  - `VITE_MSAL_BACKEND_SCOPE`
  - `VITE_API_BASE_URL`
- Wgraj przez GitHub Actions

### 2. Backend

- Utwórz Azure Container Registry.
- Utwórz Azure Container App.
- Wdróż backend jako obraz Docker do ACR.
- Skonfiguruj Container App tak, aby pobierał obraz z ACR i wystawiał port `3000`.
- Podepnij domenę produkcyjną `konto-backend.zhp.pl`.

### 3. Microsoft Entra ID

- Zarejestruj osobno frontend i backend jako dwie aplikacje w Entra ID.
- Dla frontendu ustaw platformę SPA i redirect URI:
  - `http://localhost:5173`
  - `https://konto.zhp.pl`
- Dla backendu wystaw scope API.
- Nadaj frontendowi uprawnienie do wywoływania API backendu.
- Skonfiguruj token claims tak, aby claim `memberNum` był mapowany z `user.employeeId`.
