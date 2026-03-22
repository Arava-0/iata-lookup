import { Hono } from "hono";
import { store } from "../cache/index.js";
import { ZONES } from "../config/per-diem.js";

export const iata = new Hono();

// GET /iata  →  all airports with an IATA code, enriched with country name and zone
iata.get("/", (ctx) => {
	const results = store.airports
		.filter((airport) => airport.iata_code)
		.map((airport) => {
			const country = store.byCountryCode.get(airport.iso_country.toUpperCase());

			return {
				iata_code:    airport.iata_code,
				icao_code:    airport.icao_code || "N/A",
				name:         airport.name,
				municipality: airport.municipality,
				country_name: country?.name ?? airport.iso_country,
				country_code: airport.iso_country,
				airport_type: airport.type,
				zone:         ZONES[airport.iso_country.toUpperCase()] ?? "LONG",
			};
		});

	return ctx.json(results);
});
