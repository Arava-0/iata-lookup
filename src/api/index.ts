import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { airports } from "./routes/airports.js";
import { countries } from "./routes/countries.js";
import { regions } from "./routes/regions.js";
import { frequencies } from "./routes/frequencies.js";
import { runways } from "./routes/runways.js";
import { navaids } from "./routes/navaids.js";
import { iata } from "./routes/iata.js";
import { airlines } from "./routes/airlines.js";
import { syncAll, scheduleDailySync } from "./sync.js";
import { loadAll } from "./cache/index.js";

const app = new Hono();

app.use("*", logger());

app.get("/health", (ctx) => {
	const syncFile = join(process.cwd(), "data", "sync.json");
	const syncState = existsSync(syncFile)
		? JSON.parse(readFileSync(syncFile, "utf-8")) as { synced_at: string; files: string[] }
		: null;

	return ctx.json({
		status:    "ok",
		uptime:    Math.floor(process.uptime()),
		last_sync: syncState?.synced_at ?? null,
	});
});

app.route("/airports",    airports);
app.route("/countries",   countries);
app.route("/regions",     regions);
app.route("/frequencies", frequencies);
app.route("/runways",     runways);
app.route("/navaids",     navaids);
app.route("/iata",        iata);
app.route("/airlines",    airlines);


const PORT = parseInt(process.env.PORT ?? "3000");

async function init() {
	await syncAll();
	loadAll();

	serve({ fetch: app.fetch, port: PORT }, () => {
		console.log(`IATA Lookup API  →  http://localhost:${PORT}`);
	});

	scheduleDailySync(async () => {
		loadAll();
	});
}

init().catch(console.error);
