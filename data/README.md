# data/

This folder is **not tracked in git** - CSV files are downloaded automatically at runtime.

On first start, the API fetches the following files from [OurAirports](https://ourairports.com) and stores them here:

| File | Description |
|------|-------------|
| `airports.csv` | All airports worldwide |
| `airport-frequencies.csv` | Radio frequencies per airport |
| `runways.csv` | Runway data per airport |
| `navaids.csv` | Navigation aids (VOR, NDB, ILS…) |
| `countries.csv` | Country list |
| `regions.csv` | Region list |
| `sync.json` | Last successful sync timestamp |

Files are refreshed automatically every day at **03:00**.
`sync.json` is written only after all downloads complete successfully.
