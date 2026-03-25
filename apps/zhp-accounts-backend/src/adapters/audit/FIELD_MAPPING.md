## ECS Audit Log – Mapping (ZHP Accounts)

### Core

* `@timestamp` – czas zdarzenia (UTC, ISO8601)
* `message` – opis zdarzenia (string)

---

### Log

* `log.level` – poziom logu (`info` | `warning` | `error`)

---

### Event

* `event.kind` – `event`
* `event.category` – `iam`
* `event.type` – `creation` | `change`
* `event.action` – nazwa akcji (np. `user-mailbox-create`, `user-tap-generate`)
* `event.outcome` – `success` | `failure`

---

### Data Stream

* `data_stream.type` – `logs`
* `data_stream.dataset` – `zhp.accounts`
* `data_stream.namespace` – środowisko (`dev` | `prod`)

---

### Actor (ECS User)

* `user.id` – identyfikator techniczny użytkownika, GUID z Entra ID (string)
* `user.name` – UPN użytkownika (string)

---

### Target (ECS User)

* `target.user.id` – identyfikator techniczny użytkownika, GUID z Entra ID (string)
* `target.user.name` – UPN użytkownika (string)

---

### ZHP (Dane biznesowe)

* `ZHP.Actor.MemberNumber` – numer członkowski aktora (string)
* `ZHP.Target.MemberNumber` – numer członkowski targetu (string)

---

### Authentication (custom)

* `Authentication.ValidUntil` – data ważności TAP-a (UTC, ISO8601, opcjonalne)

---

### Related

* `related.user` – lista powiązanych użytkowników (array[string]), konkretnie ID oraz name z user i target.user
