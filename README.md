# IATA Lookup

[Français](#fr---français) | [English](#en---english)

---

## FR — Français

### Présentation

**IATA Lookup** est une plateforme de recherche d'aéroports en temps réel, composée d'une API REST et d'une interface web.

- Recherche par code **IATA** (`CDG`) ou **ICAO** (`LFPG`) avec autocomplétion
- Données complètes : pistes, fréquences radio, aides à la navigation
- Données issues de [OurAirports](https://ourairports.com) — resynchronisées automatiquement chaque nuit

### Architecture

```
iata.dby-fly.fr/          →  Web  (React + Vite)     :5173
iata.dby-fly.fr/api/*     →  API  (Hono + Node.js)   :3000
```

Le reverse proxy (nginx) strip le préfixe `/api` avant de transmettre à l'API.

```
src/
├── api/          Hono REST API (TypeScript ESM)
│   ├── cache/    Chargement et indexation des CSV en mémoire
│   ├── config/   Classification des zones PN (EURO / MOYEN / LONG)
│   └── routes/   airports, countries, regions, frequencies, runways, navaids, iata
└── web/          Interface React 19 + Tailwind v4
    └── src/
        └── components/   SearchBar, AirportHeader, RunwayList, FrequencyList, NavaidList…
```

### Démarrage rapide

```bash
# Copier et adapter la configuration
cp .env.example .env

# Construire les images et démarrer
make build
```

Au premier démarrage, l'API télécharge automatiquement les 6 CSV depuis OurAirports (~85 000 aéroports).

### Configuration

Fichier `.env` à la racine :

```env
API_PORT=3000   # Port exposé pour l'API
WEB_PORT=5173   # Port exposé pour le web
```

### Commandes Make

| Commande        | Description                                      |
|-----------------|--------------------------------------------------|
| `make start`    | Démarre le stack                                 |
| `make stop`     | Arrête le stack (volumes conservés)              |
| `make restart`  | Redémarre le stack                               |
| `make build`    | Rebuild les images et démarre                    |
| `make logs`     | Logs de tous les services en continu             |
| `make logs-api` | Logs de l'API uniquement                         |
| `make logs-web` | Logs du web uniquement                           |
| `make status`   | État des conteneurs                              |
| `make delete`   | Reset complet — conteneurs et volumes supprimés  |
| `make api-shell`| Shell dans le conteneur API                      |
| `make web-shell`| Shell dans le conteneur web                      |
| `make health`   | Vérifie que l'API répond sur `/health`           |

### Développement local

```bash
# API (port 3000 par défaut)
npm run dev

# Web (port 5173, avec proxy vers l'API)
cd src/web && npm run dev
```

Le proxy Vite redirige automatiquement `/api/*` vers `http://localhost:3000`.

### API — routes principales

| Route                  | Description                                         |
|------------------------|-----------------------------------------------------|
| `GET /health`          | Statut du serveur et date du dernier sync           |
| `GET /airports`        | Liste / filtre les aéroports (`iata`, `icao`, `type`, `country`, `q`, `limit`) |
| `GET /airports/:code`  | Lookup par code IATA ou ICAO                        |
| `GET /countries`       | Liste les pays (`continent`, `q`)                   |
| `GET /countries/:code` | Lookup par code ISO (ex. `FR`)                      |
| `GET /regions`         | Liste les régions (`country`, `continent`)          |
| `GET /regions/:code`   | Lookup par code (ex. `FR-IDF`)                      |
| `GET /frequencies`     | Fréquences radio d'un aéroport (`airport` requis)  |
| `GET /runways`         | Pistes d'un aéroport (`airport` requis)             |
| `GET /navaids`         | Aides à la navigation (`airport`, `type`, `country`, `q`, `limit`) |
| `GET /iata`            | Tous les aéroports IATA enrichis (nom de pays, zone PN) |

Documentation complète des routes : [`src/api/README.md`](src/api/README.md)

### Synchronisation des données

Les CSV sont stockés dans `data/` (gitignored) et rafraîchis automatiquement chaque jour à **03:00**.

| Fichier                   | Contenu                        |
|---------------------------|--------------------------------|
| `airports.csv`            | ~85 000 aéroports mondiaux     |
| `airport-frequencies.csv` | ~30 000 fréquences radio       |
| `runways.csv`             | ~47 000 pistes                 |
| `navaids.csv`             | ~11 000 aides à la navigation  |
| `countries.csv`           | 249 pays                       |
| `regions.csv`             | ~3 900 régions                 |

---

## EN — English

### Overview

**IATA Lookup** is a real-time airport search platform, consisting of a REST API and a web interface.

- Search by **IATA** code (`CDG`) or **ICAO** code (`LFPG`) with autocomplete
- Full data: runways, radio frequencies, navigation aids
- Data sourced from [OurAirports](https://ourairports.com) — automatically re-synced every night

### Architecture

```
iata.dby-fly.fr/          →  Web  (React + Vite)     :5173
iata.dby-fly.fr/api/*     →  API  (Hono + Node.js)   :3000
```

The reverse proxy (nginx) strips the `/api` prefix before forwarding to the API.

```
src/
├── api/          Hono REST API (TypeScript ESM)
│   ├── cache/    In-memory CSV loading and indexing
│   ├── config/   PN zone classification (EURO / MOYEN / LONG)
│   └── routes/   airports, countries, regions, frequencies, runways, navaids, iata
└── web/          React 19 + Tailwind v4 frontend
    └── src/
        └── components/   SearchBar, AirportHeader, RunwayList, FrequencyList, NavaidList…
```

### Quick start

```bash
# Copy and adapt the configuration
cp .env.example .env

# Build images and start
make build
```

On first boot, the API automatically downloads the 6 CSVs from OurAirports (~85,000 airports).

### Configuration

`.env` file at the project root:

```env
API_PORT=3000   # Exposed port for the API
WEB_PORT=5173   # Exposed port for the web
```

### Make commands

| Command         | Description                                      |
|-----------------|--------------------------------------------------|
| `make start`    | Start the stack                                  |
| `make stop`     | Stop the stack (volumes preserved)               |
| `make restart`  | Restart the stack                                |
| `make build`    | Rebuild images and start                         |
| `make logs`     | Stream logs for all services                     |
| `make logs-api` | Stream API logs only                             |
| `make logs-web` | Stream web logs only                             |
| `make status`   | Show container status                            |
| `make delete`   | Full reset — removes containers and volumes      |
| `make api-shell`| Open a shell in the API container                |
| `make web-shell`| Open a shell in the web container                |
| `make health`   | Check that the API responds on `/health`         |

### Local development

```bash
# API (port 3000 by default)
npm run dev

# Web (port 5173, with proxy to the API)
cd src/web && npm run dev
```

The Vite proxy automatically forwards `/api/*` to `http://localhost:3000`.

### API — main routes

| Route                  | Description                                                    |
|------------------------|----------------------------------------------------------------|
| `GET /health`          | Server status and last sync timestamp                          |
| `GET /airports`        | List / filter airports (`iata`, `icao`, `type`, `country`, `q`, `limit`) |
| `GET /airports/:code`  | Lookup by IATA or ICAO code                                    |
| `GET /countries`       | List countries (`continent`, `q`)                              |
| `GET /countries/:code` | Lookup by ISO code (e.g. `FR`)                                 |
| `GET /regions`         | List regions (`country`, `continent`)                          |
| `GET /regions/:code`   | Lookup by code (e.g. `FR-IDF`)                                 |
| `GET /frequencies`     | Radio frequencies for an airport (`airport` required)          |
| `GET /runways`         | Runways for an airport (`airport` required)                    |
| `GET /navaids`         | Navigation aids (`airport`, `type`, `country`, `q`, `limit`)  |
| `GET /iata`            | All IATA airports enriched with country name and PN zone       |

Full route documentation: [`src/api/README.md`](src/api/README.md)

### Data sync

CSVs are stored in `data/` (gitignored) and automatically refreshed every day at **03:00**.

| File                      | Contents                       |
|---------------------------|--------------------------------|
| `airports.csv`            | ~85,000 airports worldwide     |
| `airport-frequencies.csv` | ~30,000 radio frequencies      |
| `runways.csv`             | ~47,000 runways                |
| `navaids.csv`             | ~11,000 navigation aids        |
| `countries.csv`           | 249 countries                  |
| `regions.csv`             | ~3,900 regions                 |

---

*Service provided by [DBY-FLY Group](https://dby-fly.fr) · Data from [OurAirports](https://ourairports.com)*
