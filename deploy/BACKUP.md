# Backupy CMS-a

Dane (SQLite + uploady) zostaja na serwerze; backup jest szyfrowany kluczem publicznym
`age`, a klucz prywatny istnieje wylacznie offline u czlowieka (1Password + kopia zapasowa).

## Warstwy

1. **CronJob `pruvious-backup`** (k8s, codziennie 03:15 Europe/Warsaw)
   `sqlite3 .backup` -> `PRAGMA integrity_check` -> `gzip` -> `age` -> `/data/backups`.
   Uploady: `tar | gzip | age`. Retencja na PVC: 14 dni.
2. **Timer `backup-export`** (systemd na hoscie, 03:40) — kopiuje pliki `*.age` z katalogu PVC
   (dostepnego tylko dla roota) do `~seba/backups`, zeby laptop nie potrzebowal sudo.
3. **`nb-backup-pull.sh`** (launchd na laptopie, 09:30) — `rsync` na `~/Backups/nb-cms`.
   To jest warstwa offsite: kopia poza serwerem. Retencja lokalna: 60 dni.

## Odtworzenie

```sh
# 1. odszyfruj wybrany backup (klucz prywatny tylko lokalnie)
age -d -i nb-backup.key ~/Backups/nb-cms/db-<TS>.sqlite.gz.age | gunzip > pruvious.db
sqlite3 pruvious.db 'PRAGMA integrity_check;'   # musi zwrocic ok

# 2. zatrzymaj aplikacje i podmien baze
ssh nb-vps 'kubectl -n pruvious scale deploy/pruvious --replicas=0'
scp pruvious.db nb-vps:/tmp/restore.db
ssh nb-vps 'PVC=$(sudo find /var/lib/rancher/k3s/storage -maxdepth 1 -name "*_pruvious_pruvious-data"); \
  sudo install -m 644 -o 1000 -g 1000 /tmp/restore.db $PVC/db/pruvious.db; \
  sudo rm -f $PVC/db/pruvious.db-wal $PVC/db/pruvious.db-shm; rm -f /tmp/restore.db; \
  kubectl -n pruvious scale deploy/pruvious --replicas=1'

# 3. uploady (jesli trzeba)
age -d -i nb-backup.key uploads-<TS>.tar.gz.age | tar -xzf - -C /tmp
```

**Przed kazda podmiana baza produkcyjna musi zostac zrzucona do `/data/backups/pre-restore-<TS>.db`
i sciagnieta poza serwer.** Tak wykonano restore 2026-09-23.

## Sprawdzone 2026-09-23

- backup CronJob: `backup OK 20260923T123106Z`
- odszyfrowanie + `integrity_check: ok`, zgodna liczba rekordow (trails 9, page_content 24, news 3)
- eksport na hosta i pull na laptopa: dziala

## Do zrobienia

- Healthchecks.io: `HC_BACKUP_URL` w secrecie `backup-config` jest pusty, wiec cichy fail backupu
  nie wywola alertu. Uzupelnic po zalozeniu checka.
