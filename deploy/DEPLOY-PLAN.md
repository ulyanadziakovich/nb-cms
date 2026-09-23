# Plan dokończenia wdrożenia — CMS na VPS, infrastruktura w Terraform

Stan na 2026-09-23. Serwer `vps-nb-01` (57.128.213.58) ma już wykonane fazy 1–11 runbooka
(hardening, k3s, namespace + NetworkPolicy, secret JWT) — patrz `SETUP-REPORT.md`.
Zostaje: warstwa Cloudflare/OVH-firewall, obraz aplikacji, deploy i backupy.

> **Decyzje z 2026-09-23 (nadrzędne wobec reszty dokumentu):**
> 1. **Bez Cloudflare R2.** Dane (SQLite + uploady) zostają na serwerze, na PVC.
>    Backupy: szyfrowane `age` zrzuty na PVC + **nocne ściąganie na laptopa** (offsite leg).
>    Moduł `r2.tf` wypada; `rclone` w obrazie backupowym też.
> 2. **Domena docelowa na koniec.** Na czas budowy: `nb.dexint.xyz` (strefa `dexint.xyz`
>    już w Cloudflare). Rekord DNS konfigurujesz ręcznie.
>    ⚠️ To **musi** być CNAME na `<tunnel-id>.cfargotunnel.com` (proxied), **nie** rekord A na IP
>    serwera — na VPS nie ma otwartego 80/443 i nigdy nie będzie (cała architektura stoi na tunelu).
> 3. State Terraform: lokalnie (`infra/terraform.tfstate`, w `.gitignore`), kopia w 1Password.
>    Bez R2 nie ma sensownego zdalnego backendu.

Zasada: **wszystko, co ma API, opisujemy Terraformem.** Ręcznie zostaje tylko to,
czego API nie udostępnia (lista w Etapie 0) — i to jest jednorazowe.

---

## Podział pracy

| | Ty (🧑) | Ja (🤖) |
|---|---|---|
| Etap 0 | zdobycie 8 poświadczeń + 3 decyzje | — |
| Etap 1 | — | repo `infra/` (Terraform), backend state |
| Etap 2 | — | `bootstrap.sh` (odtwarzalna warstwa hosta) |
| Etap 3 | — | Dockerfile, CI, zmiany w `nuxt.config.ts` |
| Etap 4 | `terraform apply` (po przeczytaniu planu) | kod modułów k8s + Cloudflare |
| Etap 5 | login do `/dashboard`, konto admina, treści | testy go-live, restore test, raport |

---

## Etap 0 — 🧑 czego Terraform nie zrobi za nas

Potwierdzone w dokumentacji providerów (wersje: cloudflare 5.25.0, ovh 2.20.0,
onepassword 3.3.1, healthchecksio 2.3.0):

| # | Co | Gdzie | Dlaczego ręcznie |
|---|---|---|---|
| 1 | Przeniesienie `nowoczesnebieszczady.pl` do Cloudflare (zmiana NS u rejestratora) | panel rejestratora | zmiana nameserwerów to zawsze akcja u rejestratora |
| 2 | Cloudflare API token dla Terraform | dash.cloudflare.com → My Profile → API Tokens | token, którym TF się uwierzytelnia — jajko/kura |
| 3 | ~~R2 S3 access key~~ | — | **nieaktualne** — rezygnujemy z R2 |
| 4 | GitHub PAT `read:packages` (classic) | github.com/settings/tokens | provider GitHub nie tworzy PAT-ów |
| 5 | OVH: application key / secret / consumer key | eu.api.ovh.com/createToken | uwierzytelnienie providera OVH |
| 6 | Healthchecks.io API key | healthchecks.io → Settings → API | uwierzytelnienie providera |
| 7 | Para kluczy `age` do szyfrowania backupów | lokalnie: `age-keygen -o nb-backup.key` | klucz prywatny **nigdy** nie może trafić na serwer |
| 8 | 1Password Service Account token | 1password.com → Developer → Service Accounts, dostęp tylko do vaultu „Nowoczesne Bieszczady” | uwierzytelnienie providera 1Password |

Każde z powyższych wrzuć do 1Password (vault „Nowoczesne Bieszczady”) — Terraform
czyta je stamtąd przez `data "onepassword_item"`, więc **żaden sekret nie ląduje w repo
ani w `terraform.tfvars`**. Jedyne, co trzymasz w zmiennej środowiskowej, to
`OP_SERVICE_ACCOUNT_TOKEN`.

### Zakresy tokenów (minimalne)

- **Cloudflare (TF):** Zone:Read, Zone Settings:Edit, DNS:Edit, Zone WAF:Edit,
  Cache Rules:Edit, Transform Rules:Edit, Account: Cloudflare Tunnel:Edit,
  Access: Apps and Policies:Edit, Workers R2 Storage:Edit, Notifications:Edit —
  ograniczony do jednej strefy i jednego konta.
- ~~Cloudflare (R2)~~ — nieaktualne.
- **GitHub PAT:** wyłącznie `read:packages`.
- **OVH CK:** `GET/POST/PUT/DELETE /ip/*` + `GET /vps/*`.

### Decyzje — status

1. **Plan Cloudflare:** do potwierdzenia (Free vs Pro). Wpływa tylko na rate limiting `/api/login`.
2. **Uploady:** ✅ lokalnie na PVC (decyzja z 2026-09-23, bez R2).
3. **E-mail do Cloudflare Access:** do potwierdzenia.
4. **Domena robocza:** ✅ `nb.dexint.xyz` przez CNAME na tunel.

---

## Etap 1 — 🤖 repo Terraform

Struktura w repo `nb-cms` (katalog `infra/`):

```
infra/
  versions.tf          # wymagane wersje providerow, backend
  providers.tf         # cloudflare, ovh, kubernetes, onepassword, healthchecksio, github
  secrets.tf           # data "onepassword_item" - wszystkie sekrety czytane z 1Password
  ovh.tf               # Edge Network Firewall (faza 8 runbooka, do tej pory reczna)
  cloudflare_dns.tf    # strefa, rekordy tunelu, CAA, DNSSEC
  cloudflare_tunnel.tf # tunel + ingress -> pruvious.pruvious.svc.cluster.local:3000
  cloudflare_access.tf # aplikacja self-hosted /dashboard* + polityka allow
  cloudflare_rules.tf  # naglowki bezpieczenstwa, CSP sandbox na /uploads/*, cache, rate limit /api/login
  r2.tf                # bucket + lifecycle (db/* 30 dni, uploads/archive/* 30 dni)
  healthchecks.tf      # checki pruvious-backup i vps-disk
  github.tf            # sekrety repo dla CI
  k8s_app.tf           # PVC, Deployment, Service, cloudflared, CronJob backup, Secrets
  outputs.tf
```

Ustalenia z researchu, na których stoi kod:
- tunel: `cloudflare_zero_trust_tunnel_cloudflared` z `config_src = "cloudflare"`,
  ingress w osobnym `cloudflare_zero_trust_tunnel_cloudflared_config`;
- DNS: `cloudflare_dns_record` (v5 zmienił nazwę z `cloudflare_record`), pole `content`, `ttl = 1` przy `proxied`;
- Access: polityki **inline** w `cloudflare_zero_trust_access_application` (v5);
- reguły: `cloudflare_ruleset` z fazami `http_response_headers_transform`,
  `http_request_cache_settings`, `http_ratelimit`;
- ustawienia strefy: `cloudflare_zone_setting` — jeden zasób na ustawienie;
- OVH: `ovh_ip_firewall` + `ovh_ip_firewall_rule` (`tcp_option = "established"`, `source_port = 53`) — **tylko IPv4**, dokładnie jak w runbooku;
- k8s: zasoby **typowane** (`kubernetes_deployment_v1` itd.), nie `kubernetes_manifest`
  (ten wymaga żywego API już na `terraform plan`);
- dostęp do k3s: `host = "https://127.0.0.1:6443"` przez tunel SSH
  (`ssh -f -N -L 6443:127.0.0.1:6443 nb-vps`), CA z `~/.kube/config`, bez `insecure`.

**Backend state:** R2 przez backend `s3` (`skip_credentials_validation`,
`skip_region_validation`, `skip_requesting_account_id`, `use_lockfile = true`).
State zawiera sekrety → bucket prywatny, wersjonowanie włączone.

**Zabezpieczenie przed utratą danych:** `lifecycle { prevent_destroy = true }` na PVC,
na buckecie R2 i na Secretach. `terraform destroy` na tym module ma się nie udać.

---

## Etap 2 — 🤖 warstwa hosta jako skrypt (świadomie nie Terraform)

Terraform nie jest od konfiguracji wnętrza serwera, a Ansible dla jednego hosta to przerost.
Spiszę to, co zrobiłem ręcznie, w idempotentny `infra/bootstrap/bootstrap.sh`
(user, sshd, sysctl, UFW, fail2ban, k3s z `config.yaml`) + `README` z jedną komendą
odtworzenia. Dzięki temu „nowy VPS od zera” to: zamów → uruchom bootstrap → `terraform apply`.

---

## Etap 3 — 🤖 aplikacja (repo `nb-cms`)

Do zrobienia na podstawie zweryfikowanej konfiguracji Pruvious 3.16.1:

1. **`nuxt.config.ts`** — baza i uploady na `/data`, z fallbackiem dla deva:
   ```ts
   pruvious: {
     database: process.env.NUXT_PRUVIOUS_DATABASE ?? 'sqlite:./pruvious.db',
     uploads: { drive: { type: 'local', path: process.env.NUXT_PRUVIOUS_UPLOADS_DRIVE_PATH ?? './.uploads' } },
     pageCache: { type: 'local', path: process.env.NUXT_PRUVIOUS_PAGE_CACHE_PATH ?? './.cache/pages' },
   }
   ```
   W podzie: `NUXT_PRUVIOUS_DATABASE=sqlite:/data/db/pruvious.db`,
   `NUXT_PRUVIOUS_UPLOADS_DRIVE_PATH=/data/uploads`,
   `NUXT_PRUVIOUS_PAGE_CACHE_PATH=/tmp/page-cache` (kontener ma `readOnlyRootFilesystem`).
2. **`package.json`** — `pnpm.onlyBuiltDependencies`: `sqlite3`, `sharp`, `argon2`, `esbuild`
   (pnpm 10+ domyślnie nie uruchamia build scriptów → natywny SQLite by się nie zbudował).
3. **`Dockerfile`** (multi-stage, `node:24-bookworm-slim` — Pruvious deklaruje `node >= 20`)
   + **`Dockerfile.backup`** (alpine: sqlite, rclone, age, curl).
4. **`.dockerignore`** + uzupełnienie `.gitignore` o `.ssh.*`, `*.key`, `*.pem`.
5. **`.github/workflows/build.yml`** — build obu obrazów na `linux/amd64`, push do
   `ghcr.io/ulyanadziakovich/nb-cms`, skan Trivy (CRITICAL/HIGH blokuje), cotygodniowy rebuild,
   akcje przypięte do SHA. Plus `dependabot.yml`.

⚠️ Jedna rzecz do rozwiązania w trakcie: Pruvious **nie ma** wbudowanego filtra typów
uploadu (SVG/HTML przechodzą). Dlatego na `/uploads/*` idzie `CSP: sandbox` + `nosniff`
z Cloudflare, a docelowo dopiszemy walidator w kolekcji uploads.

---

## Etap 4 — wdrożenie (kolejność ma znaczenie)

1. 🧑 `op signin` + `export OP_SERVICE_ACCOUNT_TOKEN=...`
2. 🧑 `cd infra && terraform init`
3. 🧑 `terraform apply -target=module.r2 -target=module.ovh_firewall` — najpierw bucket i firewall.
   Po firewallu weryfikacja: `apt-get update`, `getent hosts github.com`, zegar zsynchronizowany.
4. 🤖 push kodu → CI buduje obrazy → `IMAGE_TAG` = SHA commita.
5. 🧑 `terraform apply -target=module.cloudflare_access` — **Access musi istnieć przed
   publicznym hostname** (inaczej ktoś obcy może przejąć ekran pierwszej konfiguracji Pruvious).
6. 🧑 `terraform apply` — reszta: tunel, ingress, DNS, reguły, k8s (PVC, Deployment, Service,
   cloudflared, CronJob backup), Healthchecks.
7. 🤖 testy: `curl -sI https://nowoczesnebieszczady.pl/` → 200, `/dashboard` → redirect do Access,
   anonimowe `GET /api/collections/users` → 401/403, nagłówki obecne,
   `dig +short A` → tylko IP Cloudflare.
8. 🧑 logujesz się przez Access na `/dashboard`, zakładasz konto admina z silnym hasłem.
9. 🤖 ręczne uruchomienie backupu + 🧑 test odtworzenia (odszyfrowanie kluczem `age` lokalnie).
10. 🤖 reboot testowy, raport końcowy, faza 17 (hasło sudo, zdjęcie `NOPASSWD`, zablokowanie `ubuntu`).

---

## Czego świadomie NIE wrzucamy do Terraform

- **Treść CMS-a** (kolekcje, strony) — to dane, nie infrastruktura.
- **Hardening hosta** — `bootstrap.sh`, uzasadnienie w Etapie 2.
- **Rejestracja domeny i nameserwery** — po stronie rejestratora.
- **Rotacja kluczy SSH** — osobny skrypt `~/bin/rotate-ssh-key.sh`.

## Ryzyka do zaakceptowania

1. `terraform apply` na module k8s ma dostęp do PVC z bazą → `prevent_destroy` + backup przed
   każdym apply dotykającym `module.k8s_app`.
2. State w R2 zawiera sekrety w jawnej postaci → bucket prywatny, wersjonowanie, dostęp tylko z Twojego konta.
3. Cloudflare Free może nie objąć rate limitingu na `/api/login` — jeśli tak, zamiennik:
   reguła WAF + Bot Fight Mode, do potwierdzenia przy pierwszym apply.
