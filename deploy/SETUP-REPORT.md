# Raport setup VPS — nowoczesnebieszczady (faza 1–11 runbooka)

Data: 2026-09-22 · Host: `vps-nb-01` · IPv4 `57.128.213.58` · IPv6 `2001:41d0:601:1100::6ce5`

## Parametry użyte

| Zmienna | Wartość |
|---|---|
| `VPS_IP4` / `VPS_IP6` | `57.128.213.58` / `2001:41d0:601:1100::6ce5` |
| `INITIAL_USER` | `ubuntu` (nadal istnieje jako break-glass — patrz „Otwarte kroki”) |
| `ADMIN_USER` | `seba` (uid 1001, grupa `sudo`) |
| `HOSTNAME` | `vps-nb-01` |
| `TZ` | `Europe/Warsaw` |
| `SSH_MODE` | `public` (22/tcp z `ufw limit` + fail2ban, wyłącznie klucz) |
| `K3S_VERSION` | `v1.36.4+k3s1` (kanał stable z `update.k3s.io`) |
| `DB_MODE` | `sqlite` (nic jeszcze nie wdrożone) |

Dostęp: `ssh nb-vps` (alias w `~/.ssh/config`), klucz `~/.ssh/nb-vps-admin`.

## Wersje

- OS: Ubuntu **26.04.1 LTS** (runbook zakładał 24.04)
- kernel: `7.0.0-31-generic`
- k3s: `v1.36.4+k3s1`, containerd `2.3.4-k3s1.36`
- sudo: `sudo-rs 0.2.13`
- zasoby: 2 vCPU, 3.7 GiB RAM, dysk 38 GB (10% zajęte), `kubectl top node`: 89m CPU / 792Mi RAM

## Co zostało zrobione

| Faza | Status | Uwagi |
|---|---|---|
| 1 — inwentaryzacja | ✅ | host key ED25519 `SHA256:m889q8OrRavExty+5g15YHf5IumXRox5uxj8P49scks` przyjęty **TOFU** (brak porównania z konsolą KVM — R23 niezweryfikowane) |
| 2 — user `seba` | ✅ | klucz ed25519, tymczasowy `NOPASSWD` w `/etc/sudoers.d/90-setup-temp` |
| 3 — aktualizacje | ✅ | `full-upgrade`, `unattended-upgrades` (auto-reboot 04:30), `needrestart` w trybie `a`, pakiety: ufw, at, jq, curl, ca-certificates |
| 4 — sysctl / journald | ✅ | `90-hardening.conf`, `90-kubelet.conf` (wymagane przez `protect-kernel-defaults`), journald `SystemMaxUse=500M`, AppArmor aktywny (180 profili) |
| 5 — Tailscale | ⏭️ pominięta | `SSH_MODE=public` (decyzja człowieka) |
| 6 — hardening sshd | ✅ | `00-hardening.conf`; efektywnie: `permitrootlogin no`, `passwordauthentication no`, `kbdinteractive no`, `authenticationmethods publickey`, `allowusers seba`, `maxauthtries 3`. Dead-man switch użyty i skasowany po weryfikacji |
| 7 — UFW + fail2ban | ✅ | deny incoming (v4+v6), `limit 22/tcp`, allow `10.42.0.0/16`, `10.43.0.0/16`; fail2ban jail `sshd` (backend systemd, banaction ufw, 4/10m → 1h) |
| 8 — OVH Edge FW | ⛔ **czeka na człowieka** | panel OVH, patrz „Otwarte kroki” |
| 9 — k3s hardened | ✅ | secrets-encryption Enabled, traefik i servicelb wyłączone, audit log, rezerwy kubeleta (R24), `nodeport-addresses=127.0.0.1/32` (R16), kubeconfig `0600` u `seba` |
| 10 — namespace + NetPol | ✅ | ns `pruvious` (PSA enforce=restricted) + 7 NetworkPolicy z runbooka |
| 11 — sekrety | 🟡 częściowo | utworzony tylko `pruvious-app` (JWT). `ghcr`, `cloudflared`, `r2-backup` czekają na dane z kont zewnętrznych |
| 12–18 | ⏭️ poza zakresem tej sesji | obraz aplikacji, deploy, tunel CF, backupy, monitoring, domknięcie bezpieczeństwa |

## Weryfikacje (wykonane)

- SSH: logowanie kluczem OK; hasłem — `Permission denied (publickey)`; user `ubuntu` przez SSH — odrzucony (`AllowUsers`).
- Reboot kontrolowany: serwer wrócił, sysctl utrzymane, kernel podbity do 7.0.0-31.
- UFW aktywny po restarcie, `atq` puste (żaden dead-man switch nie wisi).
- k3s: `kubectl get nodes` → Ready; pody `coredns`, `local-path-provisioner`, `metrics-server` Running; brak traefik/svclb; brak Service typu NodePort/LoadBalancer.
- `k3s secrets-encrypt status` → **Enabled**, „All hashes match”.
- PSA cluster-wide: `kubectl -n default run psa-test … hostNetwork:true` → `Forbidden: violates PodSecurity "baseline:latest"`.
- Skan z zewnątrz (IPv4, z maszyny agenta): **22 open**, 6443/10250/80/443 filtered.
- Skan IPv6: **niekonkluzywny** — maszyna agenta nie ma łączności IPv6. Do powtórzenia z hosta z IPv6 (R13).

## Odstępstwa od runbooka (świadome)

1. **Ubuntu 26.04 zamiast 24.04** — taki obraz był na VPS. Konsekwencje wykryte i obsłużone niżej.
2. **`sudo-rs` (Ubuntu 26.04) nie wspiera `Defaults logfile`** — wpis usunięty z `/etc/sudoers.d/10-defaults` (zostały `use_pty` i `timestamp_timeout=5`). Logi sudo idą do journala: `journalctl -t sudo`. Audyt z fazy 17 („`sudo tail -3 /var/log/sudo.log`”) trzeba zamienić na `journalctl -t sudo -n 3`.
3. **k3s v1.36 nie ma już flagi `pod-security-admission-config-file`** — konfiguracja PSA podana standardowo przez `kube-apiserver-arg: admission-control-config-file=/var/lib/rancher/k3s/server/psa.yaml`. Zweryfikowane testem odrzucenia `hostNetwork`.
4. **Brak osobnego klucza agenta** — agent działa z maszyny człowieka, więc osobny klucz nie dawałby izolacji. Użyty jest jeden dedykowany klucz `nb-vps-admin` (łatwy do rotacji, w 1Password). Faza 17.3 traci krok „usuń klucz agenta”.
5. **`tls-san` pominięte** (brak Tailscale). Dostęp do API tylko lokalnie albo przez `ssh -L 6443:127.0.0.1:6443 nb-vps`.
6. **JWT Pruvious zapisany w 1Password** (runbook mówi „nie opuszcza serwera”) — na wyraźne życzenie: wszystkie klucze mają być rotowalne i zarchiwizowane. Wartość przeszła przez pipe do `op`, nigdy nie była wypisana w logach.
7. **fail2ban zainstalowany** — runbook przewiduje go opcjonalnie właśnie dla `SSH_MODE=public`.

## Sekrety w 1Password (vault „Nowoczesne Bieszczady”)

| Wpis | Zawartość | Jak rotować |
|---|---|---|
| `VPS nowoczesnebieszczady - SSH admin (seba)` | klucz prywatny ed25519 `nb-vps-admin` | nowy `ssh-keygen -t ed25519`, dopisz pubkey do `/home/seba/.ssh/authorized_keys`, usuń stary wpis, zaktualizuj item |
| `VPS nowoczesnebieszczady - k3s server token` | token serwera k3s (DR, R32) | `sudo k3s token rotate` + restart k3s + aktualizacja itemu |
| `Pruvious JWT secret (NUXT_PRUVIOUS_JWT_SECRET_KEY)` | JWT aplikacji (k8s secret `pruvious/pruvious-app`) | odtwórz secret z nową wartością + `rollout restart` (wylogowuje wszystkich) |
| `VPS` (istniejący) | hasło startowe usera `ubuntu` z OVH | zmień hasło (`passwd ubuntu`) albo zablokuj konto w fazie 17 |

Żaden sekret nie trafił do repo ani do logów.

## Otwarte kroki 🧑 HUMAN

1. **Faza 8 — OVH Edge Network Firewall** (panel OVH → Network → Public IP → Edge Network Firewall). Firewall jest **bezstanowy**, maks. 20 reguł, tylko IPv4:
   - prio 0: Accept TCP `established`
   - prio 1: Accept ICMP
   - prio 2: Accept UDP source port 53
   - prio 3: Accept UDP source port 123
   - prio 5: Accept TCP dest 22 (source any — tryb `public`)
   - prio 19: Deny IPv4
   Po włączeniu zweryfikuj: `sudo apt-get update`, `getent hosts github.com`, `timedatectl` (clock synchronized), SSH.
2. **Hasło sudo dla `seba`** (faza 17.1): `sudo passwd seba`. Dopóki go nie ma, `NOPASSWD` z `/etc/sudoers.d/90-setup-temp` zostaje — usuwamy go w fazie 17.
3. **Konto `ubuntu`** — celowo nienaruszone jako break-glass przez konsolę KVM (SSH i tak go nie wpuści). Do zablokowania w fazie 17.3 albo wcześniej po zmianie hasła. Hasło startowe z OVH jest w 1Password („VPS”) — **zmień je**, bo trafiło do czatu.
4. **Host key (R23)** — jeśli chcesz domknąć: w konsoli KVM `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` i porównaj z `SHA256:m889q8OrRavExty+5g15YHf5IumXRox5uxj8P49scks`.
5. **Skan z zewnątrz po IPv6** (R13) z maszyny mającej IPv6.
6. Do faz 12–16 potrzebne: domena w Cloudflare + tunel (`CF_TUNNEL_TOKEN`), bucket R2 + token, PAT GHCR (`read:packages`), klucz `age` (publiczny → serwer, prywatny offline), 2 checki Healthchecks.io. Wtedy dokończymy obraz aplikacji, deploy, tunel, backupy i monitoring.

## Pliki

- Manifesty (źródło prawdy): `cms/deploy/k8s/00-namespace.yaml`, `cms/deploy/k8s/10-netpol.yaml` — te same pliki leżą na serwerze w `~/k8s/pruvious/`.
- Log wykonania na serwerze: `~/setup-log.md`, kopia tego raportu: `~/setup-report.md`.
