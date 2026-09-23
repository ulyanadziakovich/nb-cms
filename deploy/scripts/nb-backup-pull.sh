#!/bin/sh
# Sciaga zaszyfrowane backupy CMS-a z VPS na laptopa (warstwa offsite).
# Pliki sa zaszyfrowane kluczem publicznym age - bez nb-backup.key sa bezuzyteczne.
set -eu

HOST=nb-vps
REMOTE_DIR=backups
DEST="$HOME/Backups/nb-cms"
KEEP_DAYS=60
LOG="$DEST/pull.log"

mkdir -p "$DEST"

if ! ssh -o BatchMode=yes -o ConnectTimeout=15 "$HOST" true 2>/dev/null; then
  echo "$(date '+%F %T') BLAD: brak polaczenia z $HOST" >> "$LOG"
  exit 1
fi

# -a zachowuje czasy, --ignore-existing nie nadpisuje juz sciagnietych plikow
rsync -a --ignore-existing --timeout=120 \
  "$HOST:$REMOTE_DIR/"'*.age' "$DEST/" 2>>"$LOG" || {
    echo "$(date '+%F %T') BLAD: rsync zwrocil $?" >> "$LOG"
    exit 1
  }

COUNT=$(find "$DEST" -maxdepth 1 -name '*.age' | wc -l | tr -d ' ')
NEWEST=$(ls -t "$DEST"/*.age 2>/dev/null | head -1 | xargs -I{} basename {} 2>/dev/null || echo "-")
find "$DEST" -maxdepth 1 -name '*.age' -mtime "+$KEEP_DAYS" -delete
echo "$(date '+%F %T') OK: $COUNT plikow, najnowszy $NEWEST" >> "$LOG"
