# IATA Lookup — API Reference

Lightweight REST API serving aeronautical data from [OurAirports](https://ourairports.com/data/).
Data is loaded into memory at startup and automatically re-synced every day at **03:00**.

## Start

```bash
npm run dev      # development (watch mode)
npm start        # production
```

Default port: **3000** — override with the `PORT` environment variable.

---

## Routes

### `GET /health`

Returns server status and last successful sync timestamp.

```json
{
  "status": "ok",
  "uptime": 142,
  "last_sync": "2025-03-22T03:00:12.000Z"
}
```

| Field       | Type             | Description                        |
|-------------|------------------|------------------------------------|
| `status`    | `string`         | Always `"ok"`                      |
| `uptime`    | `number`         | Server uptime in seconds           |
| `last_sync` | `string \| null` | ISO timestamp of last sync, or `null` if never synced |

---

### `GET /airports`

Search and filter airports.

**Query params**

| Param     | Type     | Description                                                            |
|-----------|----------|------------------------------------------------------------------------|
| `iata`    | `string` | Exact IATA code (e.g. `CDG`). Short-circuits all other filters.        |
| `icao`    | `string` | Exact ICAO code (e.g. `LFPG`). Short-circuits all other filters.       |
| `type`    | `string` | Airport type: `large_airport`, `medium_airport`, `small_airport`, `heliport`, `seaplane_base`, `balloonport`, `closed` |
| `country` | `string` | ISO country code (e.g. `FR`)                                           |
| `q`       | `string` | Full-text search on name, city, IATA/ICAO code                         |
| `limit`   | `number` | Max results (default: `100`, max: `1000`)                              |

**Response** — `Airport[]`
```json
[
  {
    "id": "1382313",
    "ident": "LFPG",
    "type": "large_airport",
    "name": "Paris Charles de Gaulle Airport",
    "latitude_deg": "49.012798",
    "longitude_deg": "2.55",
    "elevation_ft": "392",
    "continent": "EU",
    "iso_country": "FR",
    "iso_region": "FR-IDF",
    "municipality": "Paris",
    "scheduled_service": "yes",
    "icao_code": "LFPG",
    "iata_code": "CDG",
    "gps_code": "LFPG",
    "local_code": "",
    "home_link": "https://www.parisaeroport.fr/",
    "wikipedia_link": "https://en.wikipedia.org/wiki/Charles_de_Gaulle_Airport",
    "keywords": ""
  }
]
```

---

### `GET /airports/:code`

Lookup an airport by **IATA** or **ICAO** code (case-insensitive).

```
GET /airports/CDG
GET /airports/LFPG
```

**Response** — `Airport` object (same structure as above)
**404** if not found.

---

### `GET /countries`

List countries.

**Query params**

| Param       | Type     | Description                                                    |
|-------------|----------|----------------------------------------------------------------|
| `continent` | `string` | Filter by continent: `AF`, `AN`, `AS`, `EU`, `NA`, `OC`, `SA` |
| `q`         | `string` | Full-text search on name or ISO code                           |

**Response** — `Country[]`
```json
[
  {
    "id": "302817",
    "code": "FR",
    "name": "France",
    "continent": "EU",
    "wikipedia_link": "https://en.wikipedia.org/wiki/France",
    "keywords": ""
  }
]
```

---

### `GET /countries/:code`

Lookup a country by **ISO 3166-1 alpha-2** code (e.g. `FR`, `US`).

**Response** — `Country` object (same structure as above)
**404** if not found.

---

### `GET /regions`

List regions (administrative subdivisions of countries).

**Query params**

| Param       | Type     | Description                           |
|-------------|----------|---------------------------------------|
| `country`   | `string` | Filter by ISO country code (e.g. `FR`) |
| `continent` | `string` | Filter by continent (e.g. `EU`)        |

**Response** — `Region[]`
```json
[
  {
    "id": "302828",
    "code": "FR-IDF",
    "local_code": "IDF",
    "name": "Île-de-France",
    "continent": "EU",
    "iso_country": "FR",
    "wikipedia_link": "https://en.wikipedia.org/wiki/%C3%8Ele-de-France",
    "keywords": ""
  }
]
```

---

### `GET /regions/:code`

Lookup a region by code (e.g. `FR-IDF`, `US-CA`).

**Response** — `Region` object (same structure as above)
**404** if not found.

---

### `GET /frequencies?airport=`

Returns radio frequencies for an airport.

**Query params**

| Param     | Type     | Required | Description                              |
|-----------|----------|----------|------------------------------------------|
| `airport` | `string` | ✅       | ICAO identifier of the airport (e.g. `LFPG`) |

**Response** — `Frequency[]`
```json
[
  {
    "id": "89003",
    "airport_ref": "1382313",
    "airport_ident": "LFPG",
    "type": "TWR",
    "description": "Tower North",
    "frequency_mhz": "119.25"
  }
]
```

| Field           | Description                                                       |
|-----------------|-------------------------------------------------------------------|
| `type`          | Frequency type: `TWR`, `APP`, `GND`, `ATIS`, `CTAF`, `DEP`, `UNIC`, etc. |
| `frequency_mhz` | Frequency in MHz                                                  |

**400** if `airport` param is missing.

---

### `GET /runways?airport=`

Returns runways for an airport.

**Query params**

| Param     | Type     | Required | Description                              |
|-----------|----------|----------|------------------------------------------|
| `airport` | `string` | ✅       | ICAO identifier of the airport (e.g. `LFPG`) |

**Response** — `Runway[]`
```json
[
  {
    "id": "269408",
    "airport_ref": "1382313",
    "airport_ident": "LFPG",
    "length_ft": "13829",
    "width_ft": "197",
    "surface": "ASP",
    "lighted": "1",
    "closed": "0",
    "le_ident": "08L",
    "le_latitude_deg": "49.0169982910156",
    "le_longitude_deg": "2.47880005836487",
    "le_elevation_ft": "387",
    "le_heading_degT": "85",
    "le_displaced_threshold_ft": "",
    "he_ident": "26R",
    "he_latitude_deg": "49.0246009826660",
    "he_longitude_deg": "2.62060010433197",
    "he_elevation_ft": "388",
    "he_heading_degT": "265",
    "he_displaced_threshold_ft": ""
  }
]
```

| Field        | Description                                                |
|--------------|------------------------------------------------------------|
| `length_ft`  | Length in feet                                             |
| `width_ft`   | Width in feet                                              |
| `surface`    | Surface type (`ASP`, `CON`, `GRS`, `GRE`, `TURF`, etc.)   |
| `lighted`    | `"1"` if lit, `"0"` otherwise                              |
| `closed`     | `"1"` if closed, `"0"` otherwise                           |
| `le_*`       | Low End threshold data                                     |
| `he_*`       | High End threshold data                                    |

**400** if `airport` param is missing.

---

### `GET /navaids`

Search navigation aids (VOR, NDB, ILS, etc.).

**Query params**

| Param     | Type     | Description                                                         |
|-----------|----------|---------------------------------------------------------------------|
| `airport` | `string` | Filter by associated airport (e.g. `LFPG`)                          |
| `type`    | `string` | Navaid type: `VOR`, `NDB`, `ILS`, `LOC`, `DME`, `VORDME`, `TACAN`, etc. |
| `country` | `string` | Filter by ISO country code (e.g. `FR`)                              |
| `q`       | `string` | Full-text search on name or identifier                              |
| `limit`   | `number` | Max results (default: `100`, max: `1000`)                           |

**Response** — `Navaid[]`
```json
[
  {
    "id": "86268",
    "ident": "CDG",
    "name": "CHARLES DE GAULLE",
    "type": "VORDME",
    "frequency_khz": "114200",
    "latitude_deg": "49.0097",
    "longitude_deg": "2.5878",
    "elevation_ft": "365",
    "iso_country": "FR",
    "magnetic_variation_deg": "-0.248",
    "usageType": "HI_LOW",
    "power": "HIGH",
    "associated_airport": "LFPG"
  }
]
```

---

### `GET /iata`

Returns all airports that have an IATA code, enriched with country name and PN zone.

**Response** — `IataEntry[]`
```json
[
  {
    "iata_code": "CDG",
    "icao_code": "LFPG",
    "name": "Paris Charles de Gaulle Airport",
    "municipality": "Paris",
    "country_name": "France",
    "country_code": "FR",
    "airport_type": "large_airport",
    "zone": "EURO"
  }
]
```

| Field          | Description                                           |
|----------------|-------------------------------------------------------|
| `zone`         | PN per diem zone: `EURO`, `MOYEN`, or `LONG`          |
| `airport_type` | `large_airport`, `medium_airport`, `small_airport`, etc. |

---

## Data sync

CSVs are downloaded from [ourairports.com](https://ourairports.com/data/) and stored in `data/` at the project root.

On startup, each file is downloaded **only if it is older than 24 hours**.
A cron job re-downloads all files every day at **03:00** (server local time).

| File                      | Contents                       |
|---------------------------|--------------------------------|
| `airports.csv`            | ~85,000 airports worldwide     |
| `airport-frequencies.csv` | ~30,000 radio frequencies      |
| `runways.csv`             | ~47,000 runways                |
| `navaids.csv`             | ~11,000 navigation aids        |
| `countries.csv`           | 249 countries                  |
| `regions.csv`             | ~3,900 regions                 |
