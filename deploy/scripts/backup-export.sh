#!/bin/sh
# Kopiuje zaszyfrowane backupy z PVC (katalog root-only) do ~seba/backups,
# zeby laptop mogl je sciagnac bez sudo. Uruchamiany przez timer systemd.
set -eu

DEST=/home/seba/backups
KEEP_DAYS=14

SRC=$(find /var/lib/rancher/k3s/storage -maxdepth 1 -type d -name '*_pruvious_pruvious-data' | head -1)
[ -n "$SRC" ] || { echo "nie znaleziono katalogu PVC"; exit 1; }
SRC="$SRC/backups"
[ -d "$SRC" ] || { echo "brak katalogu $SRC"; exit 1; }

install -d -m 700 -o seba -g seba "$DEST"

# tylko pliki zaszyfrowane; pre-restore*.db sa jawne i zostaja na PVC
find "$SRC" -maxdepth 1 -type f -name '*.age' -print | while IFS= read -r f; do
  b=$(basename "$f")
  [ -f "$DEST/$b" ] && continue
  install -m 600 -o seba -g seba "$f" "$DEST/$b"
  echo "skopiowano $b"
done

find "$DEST" -maxdepth 1 -type f -name '*.age' -mtime "+$KEEP_DAYS" -delete
echo "export OK: $(find "$DEST" -maxdepth 1 -name '*.age' | wc -l) plikow w $DEST"
