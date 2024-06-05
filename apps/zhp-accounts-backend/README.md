# ZHP accounts (backend)

Aplikacja Azure Functions do obsługi kont użytkowników ZHP. Napisana w języku Python
(v3.11, programming model v2).

## Uruchamianie

### Wymagania

- Python 3.11 z pip
- [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-python#install-the-azure-functions-core-tools)

### Po raz pierwszy

1. Stwórz venv i zainstaluj biblioteki:

```bash
python3 -m venv .venv  # lub python lub py
pip install -r requirements.txt
```

### Po raz kolejny

1. Aktywuj venv:

```bash
source .venv/bin/activate  # lub .venv\Scripts\Activate.ps1
```

2. Uruchom funkcję:

```bash
func start
```

Enjoy!

## Struktura plików

```text
.
├── .env                # Environment variables (copy from .env.example)
├── .env.example        # Sample environment variables
├── function_app.py     # Main executable
├── host.json           # Functions settings
├── requirements.txt    # Dependencies
└── src/                # Main code
    ├── domain/         # All domain-related code
    ├── tests/          # All testing code
    └── zhp_accounts/   # All implementations - adapters of domain interfaces, actual Functions definitions
```

## Funkcje

Azure Functions Python programming model v2 wymaga centralnego pliku `function_app.py`,
który definiuje wszystkie funkcje. Pozwala jednak, dzięki funkcjonalności `blueprints`,
przenosić definicje funkcji do innych plików i ładować je w głównym.

W naszym przypadku, blueprinty będą definiowane w folderze `src/zhp_accounts/functions/`.
Jest tam dostępny plik `hello_world.py` z przykładową funkcją.

Jeśli tworzysz nową funkcję (w nowym pliku), to pamiętaj, żeby ją załadować w 
`function_app.py`:

```python
from src.zhp_accounts.functions.{nazwa_funkcji} import bp

# ...

app.register_functions(bp)
```

## Zmienne środowiskowe

Główna `function_app.py` ładuje zmienne środowiskowe z pliku `.env`, więc w plikach funkcji można
odczytywać je za pomocą np. `os.getenv('{nazwa}')`.
