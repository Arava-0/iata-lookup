import { readFileSync } from "node:fs";
import { join } from "node:path";
import Papa from "papaparse";
import { store } from "./store.js";
import type { Airport, Country, Frequency, Navaid, Region, Runway } from "./types.js";

const DATA_DIR = join(process.cwd(), "data");

function parseCSV<Row>(filename: string): Row[] {
	const text = readFileSync(join(DATA_DIR, filename), "utf-8");

	const { data, errors } = Papa.parse<Row>(text, {
		header:          true,
		skipEmptyLines:  true,
		transformHeader: (header) => header.trim(),
	});

	if (errors.length > 0) {
		console.warn(`[cache] ${filename}: ${errors.length} parse warning(s)`, errors[0]);
	}

	return data;
}

export function loadAll(): void {
	console.log("[cache] Loading CSVs into memory");

	// Airports
	store.airports = parseCSV<Airport>("airports.csv");
	store.byIata.clear();
	store.byIcao.clear();

	for (const airport of store.airports) {
		if (airport.iata_code)
			store.byIata.set(airport.iata_code.toUpperCase(), airport);

		if (airport.icao_code)
			store.byIcao.set(airport.icao_code.toUpperCase(), airport);

		if (airport.ident)
			store.byIcao.set(airport.ident.toUpperCase(), airport);
	}

	// Countries
	store.countries = parseCSV<Country>("countries.csv");
	store.byCountryCode.clear();

	for (const country of store.countries) {
		store.byCountryCode.set(country.code.toUpperCase(), country);
	}

	// Regions
	store.regions = parseCSV<Region>("regions.csv");
	store.byRegionCode.clear();

	for (const region of store.regions) {
		store.byRegionCode.set(region.code.toUpperCase(), region);
	}

	// Frequencies (grouped by airport_ident)
	const allFrequencies = parseCSV<Frequency>("airport-frequencies.csv");
	store.frequencies.clear();

	for (const freq of allFrequencies) {
		const key = freq.airport_ident.toUpperCase();

		if (!store.frequencies.has(key))
			store.frequencies.set(key, []);

		store.frequencies.get(key)!.push(freq);
	}

	// Runways (grouped by airport_ident)
	const allRunways = parseCSV<Runway>("runways.csv");
	store.runways.clear();

	for (const runway of allRunways) {
		const key = runway.airport_ident.toUpperCase();

		if (!store.runways.has(key))
			store.runways.set(key, []);

		store.runways.get(key)!.push(runway);
	}

	// Navaids
	store.navaids = parseCSV<Navaid>("navaids.csv");

	console.log(
		`[cache] Loaded: ${store.airports.length} airports, ${store.countries.length} countries, ` +
		`${store.regions.length} regions, ${allFrequencies.length} frequencies, ` +
		`${allRunways.length} runways, ${store.navaids.length} navaids.`
	);
}
