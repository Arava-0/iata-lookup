import { Hono } from "hono";
import { store } from "../cache/index.js";

export const frequencies = new Hono();

// GET /frequencies?airport=LFPG
frequencies.get("/", (ctx) => {
	const { airport } = ctx.req.query();

	if (!airport)
		return ctx.json({ error: "?airport= is required" }, 400);

	const results = store.frequencies.get(airport.toUpperCase()) ?? [];
	return ctx.json(results);
});
