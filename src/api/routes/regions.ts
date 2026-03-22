import { Hono } from "hono";
import { store } from "../cache/index.js";

export const regions = new Hono();

// GET /regions?country=&continent=
regions.get("/", (ctx) => {
	const { country, continent } = ctx.req.query();
	let results = store.regions;

	if (country) {
		results = results.filter(
			(region) => region.iso_country.toUpperCase() === country.toUpperCase()
		);
	}

	if (continent) {
		results = results.filter(
			(region) => region.continent === continent.toUpperCase()
		);
	}

	return ctx.json(results);
});

// GET /regions/:code
regions.get("/:code", (ctx) => {
	const code = ctx.req.param("code").toUpperCase();
	const region = store.byRegionCode.get(code);

	if (!region)
		return ctx.json({ error: "Not found" }, 404);

	return ctx.json(region);
});
