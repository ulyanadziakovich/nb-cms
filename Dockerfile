# syntax=docker/dockerfile:1

# ---------- stage: build ----------
# Ten sam obraz bazowy w obu stage, zeby natywne bindingi (sqlite3, sharp, argon2)
# skompilowane tutaj dzialaly bez zmian w runtime.
FROM node:24-bookworm-slim AS build

# Toolchain dla `npm rebuild sqlite3 --build-from-source` z postinstall.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Zrodla kopiujemy PRZED `npm ci`, bo postinstall odpala `nuxt prepare`,
# ktory potrzebuje nuxt.config.ts i katalogu app/.
COPY . .

RUN npm ci
RUN npm run build

# ---------- stage: runtime ----------
FROM node:24-bookworm-slim AS runtime

WORKDIR /app

# Runtime odpala `node .output/server/index.mjs` - npm nie jest potrzebny, a jego
# wbudowane zaleznosci (m.in. brace-expansion) podbijaja wynik skanu CVE.
# Usuniecie zmniejsza tez powierzchnie ataku w kontenerze.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Nitro (preset node-server) tracuje zaleznosci przez @vercel/nft i kopiuje je
# razem z plikami .node do .output/server/node_modules, wiec .output jest
# samowystarczalny - nie kopiujemy reszty node_modules.
COPY --from=build --chown=node:node /app/.output ./.output

ENV NODE_ENV=production \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000

# Zadnych NUXT_PRUVIOUS_* w obrazie - sciezki i sekrety wstrzykuje Deployment.

USER node
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
