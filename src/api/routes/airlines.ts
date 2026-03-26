import { Hono } from "hono";
import { store } from "../cache/index.js";

export const airlines = new Hono();

// GET /airlines?q=&country=&active=
airlines.get("/", (ctx) => {
	const { q: searchQuery, country, active } = ctx.req.query();
	let results = store.airlines;

	if (active !== undefined) {
		const onlyActive = active !== "false";
		results = results.filter((a) => a.active === onlyActive);
	}

	if (country) {
		const c = country.toLowerCase();
		results = results.filter((a) => a.country.toLowerCase().includes(c));
	}

	if (searchQuery) {
		const q = searchQuery.toLowerCase();
		results = results.filter(
			(a) =>
				a.name.toLowerCase().includes(q) ||
				a.iata.toLowerCase() === q ||
				a.icao.toLowerCase() === q ||
				a.callsign.toLowerCase().includes(q)
		);
	}

	return ctx.json(results);
});

// GET /airlines/:code  (IATA 2-letter or ICAO 3-letter)
airlines.get("/:code", (ctx) => {
	const code = ctx.req.param("code").toUpperCase();
	const airline = store.byAirlineIata.get(code) ?? store.byAirlineIcao.get(code);

	if (!airline)
		return ctx.json({ error: "Not found" }, 404);

	return ctx.json(airline);
});
