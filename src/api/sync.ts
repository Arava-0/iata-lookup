import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import cron from "node-cron";

const DATA_DIR = join(process.cwd(), "data");

const SOURCES: Record<string, string> = {
	"airports.csv":            "https://davidmegginson.github.io/ourairports-data/airports.csv",
	"airport-frequencies.csv": "https://davidmegginson.github.io/ourairports-data/airport-frequencies.csv",
	"runways.csv":             "https://davidmegginson.github.io/ourairports-data/runways.csv",
	"navaids.csv":             "https://davidmegginson.github.io/ourairports-data/navaids.csv",
	"countries.csv":           "https://davidmegginson.github.io/ourairports-data/countries.csv",
	"regions.csv":             "https://davidmegginson.github.io/ourairports-data/regions.csv",
	"airlines.dat":            "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat",
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function isStale(filePath: string): boolean {
	if (!existsSync(filePath))
		return true;

	const ageMs = Date.now() - statSync(filePath).mtimeMs;
	return ageMs > ONE_DAY_MS;
}

async function downloadFile(url: string, destPath: string): Promise<void> {
	console.log(`[sync] Downloading ${url}`);

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.status}`);
	}

	const content = await response.text();
	writeFileSync(destPath, content, "utf-8");

	console.log(`[sync] Saved → ${destPath}`);
}

export async function syncAll(force = false): Promise<void> {
	mkdirSync(DATA_DIR, { recursive: true });

	const staleFiles = Object.entries(SOURCES).filter(([filename]) =>
		force || isStale(join(DATA_DIR, filename))
	);

	if (staleFiles.length === 0) {
		console.log("[sync] All files are fresh, skipping.");
		return;
	}

	await Promise.all(
		staleFiles.map(([filename, url]) =>
			downloadFile(url, join(DATA_DIR, filename))
		)
	);

	// Write sync state only if all downloads succeeded
	writeFileSync(
		join(DATA_DIR, "sync.json"),
		JSON.stringify({ synced_at: new Date().toISOString(), files: staleFiles.map(([f]) => f) }),
		"utf-8"
	);

	console.log("[sync] Done.");
}

export function scheduleDailySync(onDone: () => Promise<void>): void {
	cron.schedule("0 3 * * *", async () => {
		console.log("[sync] Daily sync triggered.");

		try {
			await syncAll(true);
			await onDone();
		} catch (error) {
			console.error("[sync] Daily sync failed:", error);
		}
	});
}
