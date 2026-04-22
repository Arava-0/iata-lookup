import { Hono } from "hono";
import { store } from "../cache/index.js";
import type { Country } from "../cache/index.js";
import { ZONES } from "../config/per-diem.js";

export const countries = new Hono();

function toZone(code: string) {
	return ZONES[code] ?? "LONG";
}

function formatCountry(country: Country, enrich: boolean, slim: boolean) {
	const zone = enrich ? { zone: toZone(country.code) } : {};
	if (slim) {
		return { code: country.code, name: country.name, continent: country.continent, ...zone };
	}
	return { ...country, ...zone };
}

// GET /countries?continent=&q=&enrich=true&slim=true
countries.get("/", (ctx) => {
	const { continent, q: searchQuery, enrich, slim } = ctx.req.query();
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

	const doEnrich = enrich === "true";
	const doSlim = slim === "true";

	return ctx.json(results.map((c) => formatCountry(c, doEnrich, doSlim)));
});

// GET /countries/:code?enrich=true&slim=true
countries.get("/:code", (ctx) => {
	const code = ctx.req.param("code").toUpperCase();
	const country = store.byCountryCode.get(code);

	if (!country)
		return ctx.json({ error: "Not found" }, 404);

	const { enrich, slim } = ctx.req.query();
	return ctx.json(formatCountry(country, enrich === "true", slim === "true"));
});
