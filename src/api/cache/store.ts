import type { Airport, Country, Frequency, Navaid, Region, Runway } from "./types.js";

export const store = {
	airports:      [] as Airport[],
	byIata:        new Map<string, Airport>(),   // IATA code  → airport
	byIcao:        new Map<string, Airport>(),   // ICAO/ident → airport

	countries:     [] as Country[],
	byCountryCode: new Map<string, Country>(),

	regions:       [] as Region[],
	byRegionCode:  new Map<string, Region>(),

	frequencies:   new Map<string, Frequency[]>(),  // airport_ident → frequencies[]
	runways:       new Map<string, Runway[]>(),       // airport_ident → runways[]
	navaids:       [] as Navaid[],
};
