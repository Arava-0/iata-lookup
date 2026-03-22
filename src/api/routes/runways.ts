import { Hono } from "hono";
import { store } from "../cache/index.js";

export const runways = new Hono();

// GET /runways?airport=LFPG
runways.get("/", (ctx) => {
	const { airport } = ctx.req.query();

	if (!airport)
		return ctx.json({ error: "?airport= is required" }, 400);

	const results = store.runways.get(airport.toUpperCase()) ?? [];
	return ctx.json(results);
});
