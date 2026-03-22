import { Hono } from "hono";
import { store } from "../cache/index.js";

export const airports = new Hono();

// GET /airports?iata=&icao=&type=&country=&q=&limit=
airports.get("/", (ctx) => {
	const { iata, icao, type, country, q: searchQuery, limit } = ctx.req.query();
	const maxResults = Math.min(parseInt(limit ?? "100"), 1000);

	// Fast path: direct lookup by IATA or ICAO
	if (iata) {
		const airport = store.byIata.get(iata.toUpperCase());
		return ctx.json(airport ? [airport] : []);
	}

	if (icao) {
		const airport = store.byIcao.get(icao.toUpperCase());
		return ctx.json(airport ? [airport] : []);
	}

	// Filtered scan
	let results = store.airports;

	if (type) {
		results = results.filter((airport) => airport.type === type);
	}

	if (country) {
		results = results.filter(
			(airport) => airport.iso_country.toUpperCase() === country.toUpperCase()
		);
	}

	if (searchQuery) {
		const search = searchQuery.toLowerCase();

		results = results.filter(
			(airport) =>
				airport.name.toLowerCase().includes(search) ||
				airport.municipality.toLowerCase().includes(search) ||
				airport.iata_code.toLowerCase().includes(search) ||
				airport.icao_code.toLowerCase().includes(search)
		);
	}

	return ctx.json(results.slice(0, maxResults));
});

// GET /airports/:code  →  lookup by IATA or ICAO code
airports.get("/:code", (ctx) => {
	const code = ctx.req.param("code").toUpperCase();
	const airport = store.byIata.get(code) ?? store.byIcao.get(code);

	if (!airport)
		return ctx.json({ error: "Not found" }, 404);

	return ctx.json(airport);
});
