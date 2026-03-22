import type { Airport, Frequency, Navaid, Runway } from "./types";

const BASE = "/api";

async function get<T>(path: string): Promise<T> {
	const response = await fetch(`${BASE}${path}`);

	if (!response.ok)
		throw new Error(`${response.status} ${response.statusText}`);

	return response.json() as Promise<T>;
}

export async function lookupAirport(code: string): Promise<Airport> {
	return get<Airport>(`/airports/${encodeURIComponent(code.toUpperCase())}`);
}

export async function getRunways(ident: string): Promise<Runway[]> {
	return get<Runway[]>(`/runways?airport=${encodeURIComponent(ident)}`);
}

export async function getFrequencies(ident: string): Promise<Frequency[]> {
	return get<Frequency[]>(`/frequencies?airport=${encodeURIComponent(ident)}`);
}

export async function getNavaids(ident: string): Promise<Navaid[]> {
	return get<Navaid[]>(`/navaids?airport=${encodeURIComponent(ident)}`);
}
