import { Hono } from "hono";
import { store } from "../cache/index.js";

export const navaids = new Hono();

// GET /navaids?airport=LFPG&type=VOR&country=FR&q=&limit=
navaids.get("/", (ctx) => {
	const { airport, type, country, q: searchQuery, limit } = ctx.req.query();
	const maxResults = Math.min(parseInt(limit ?? "100"), 1000);
	let results = store.navaids;

	if (airport) {
		results = results.filter(
			(navaid) => navaid.associated_airport.toUpperCase() === airport.toUpperCase()
		);
	}

	if (type) {
		results = results.filter(
			(navaid) => navaid.type.toUpperCase() === type.toUpperCase()
		);
	}

	if (country) {
		results = results.filter(
			(navaid) => navaid.iso_country.toUpperCase() === country.toUpperCase()
		);
	}

	if (searchQuery) {
		const search = searchQuery.toLowerCase();

		results = results.filter(
			(navaid) =>
				navaid.name.toLowerCase().includes(search) ||
				navaid.ident.toLowerCase().includes(search)
		);
	}

	return ctx.json(results.slice(0, maxResults));
});
