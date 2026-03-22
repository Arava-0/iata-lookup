import { Hono } from "hono";
import { store } from "../cache/index.js";

export const countries = new Hono();

// GET /countries?continent=&q=
countries.get("/", (ctx) => {
	const { continent, q: searchQuery } = ctx.req.query();
	let results = store.countries;

	if (continent) {
		results = results.filter(
			(country) => country.continent === continent.toUpperCase()
		);
	}

	if (searchQuery) {
		const search = searchQuery.toLowerCase();

		results = results.filter(
			(country) =>
				country.name.toLowerCase().includes(search) ||
				country.code.toLowerCase().includes(search)
		);
	}

	return ctx.json(results);
});

// GET /countries/:code
countries.get("/:code", (ctx) => {
	const code = ctx.req.param("code").toUpperCase();
	const country = store.byCountryCode.get(code);

	if (!country)
		return ctx.json({ error: "Not found" }, 404);

	return ctx.json(country);
});
