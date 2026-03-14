# ZHP Accounts Frontend

Aplikacja frontendowa do zarządzania kontami Microsoft 365 dla członków ZHP.

## Technologie

- **Svelte 5** - framework UI
- **Vite 6** - bundler
- **Tailwind CSS 4** - style
- **Skeleton UI** - komponenty UI
- **TypeScript** - typowanie
- **Vitest** - testy

## Architektura

Aplikacja wykorzystuje wzorzec **Ports & Adapters** (Hexagonal Architecture):

- `src/lib/ports/` - interfejsy (kontrakty)
- `src/lib/adapters/` - implementacje
- `src/lib/stores/` - stan aplikacji (Svelte stores)
- `src/routes/` - komponenty stron

### Tryb Mock

Dodaj `?mock=true` do URL aby używać mockowanych danych zamiast prawdziwego API.

## Skrypty

```bash
# Instalacja zależności
pnpm install

# Uruchomienie dev server (z lokalnym backendem)
pnpm dev

# Testowanie z production backendem (frontonly mode)
pnpm dev --mode frontonly

# Build produkcyjny
pnpm build

# Podgląd buildu
pnpm preview

# Testy
pnpm test
pnpm test:watch
pnpm test:ui

# Linting
pnpm lint
pnpm lint:fix

# Type check
pnpm check
```

## Zmienne środowiskowe (Environment Variables)

Konfiguracja jest zarządzana poprzez `.env.[mode]` pliki, które są przechowywane w repozytorium (bez sekretów):

### Dostępne tryby

- **`.env.development`** - Uruchamianie z lokalnymi backendem (`pnpm dev`)
- **`.env.frontonly`** - Uruchamianie z production backendem (`pnpm dev --mode frontonly`)
- **`.env.production`** - Build do produkcji (`pnpm build`)

### Konfiguracja dla deweloperów

Wszystkie ustawienia są już skonfigurowane w `.env.[mode]` plikach. **Nie trzeba nic dodawać do `.gitignore`**.

Zmienne do ustawienia (placeholder values):
- `VITE_MSAL_CLIENT_ID` - Azure App Registration Client ID
- `VITE_MSAL_TENANT_ID` - Azure Tenant ID
- `VITE_MSAL_BACKEND_SCOPE` - Backend API OAuth scope

Szczegóły: zobacz [AUTHENTICATION.md](./AUTHENTICATION.md)

## Routing

Aplikacja używa hash-routingu (`svelte-spa-router`):

- `#/` - Strona główna
- `#/units` - Lista jednostek
- `#/units/:id/members` - Członkowie jednostki

## Deployment

Aplikacja jest deployowana jako statyczne pliki na Cloudflare Pages.
