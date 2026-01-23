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

# Uruchomienie dev server
pnpm dev

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

## Zmienne środowiskowe

Utwórz plik `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Routing

Aplikacja używa hash-routingu (`svelte-spa-router`):

- `#/` - Strona główna
- `#/units` - Lista jednostek
- `#/units/:id/members` - Członkowie jednostki
- `#/profile` - Profil użytkownika

## Deployment

Aplikacja jest deployowana jako statyczne pliki na Cloudflare Pages.
