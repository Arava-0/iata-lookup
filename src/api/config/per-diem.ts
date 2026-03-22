export type Zone = "EURO" | "MOYEN" | "LONG";

// EURO / MEDIUM HAUL zone scale — PN per diem 2024
// Source: Direction générale des Finances publiques
// Any country absent from this map defaults to Zone LONG
export const ZONES: Record<string, Zone> = {
	// ── EURO Zone ─────────────────────────────────────────────────────────────
	DE: "EURO", // Germany
	AT: "EURO", // Austria
	BE: "EURO", // Belgium
	CY: "EURO", // Cyprus
	HR: "EURO", // Croatia
	ES: "EURO", // Spain
	EE: "EURO", // Estonia
	FI: "EURO", // Finland
	FR: "EURO", // France
	GR: "EURO", // Greece
	GP: "EURO", // Guadeloupe
	GF: "EURO", // French Guiana
	IE: "EURO", // Ireland
	IT: "EURO", // Italy
	RE: "EURO", // Réunion
	LV: "EURO", // Latvia
	LT: "EURO", // Lithuania
	LU: "EURO", // Luxembourg
	MT: "EURO", // Malta
	MQ: "EURO", // Martinique
	YT: "EURO", // Mayotte
	NL: "EURO", // Netherlands
	PT: "EURO", // Portugal
	BL: "EURO", // Saint Barthélemy
	MF: "EURO", // Saint Martin (French part)
	PM: "EURO", // Saint Pierre and Miquelon
	SK: "EURO", // Slovakia
	SI: "EURO", // Slovenia

	// ── MEDIUM HAUL Zone ──────────────────────────────────────────────────────
	AL: "MOYEN", // Albania
	DZ: "MOYEN", // Algeria
	BA: "MOYEN", // Bosnia-Herzegovina
	BG: "MOYEN", // Bulgaria
	DK: "MOYEN", // Denmark
	GB: "MOYEN", // Great Britain
	HU: "MOYEN", // Hungary
	IS: "MOYEN", // Iceland
	LI: "MOYEN", // Liechtenstein
	MK: "MOYEN", // North Macedonia
	MA: "MOYEN", // Morocco
	ME: "MOYEN", // Montenegro
	NO: "MOYEN", // Norway
	PL: "MOYEN", // Poland
	CZ: "MOYEN", // Czech Republic
	RO: "MOYEN", // Romania
	RS: "MOYEN", // Serbia
	SE: "MOYEN", // Sweden
	CH: "MOYEN", // Switzerland
	TN: "MOYEN", // Tunisia
};
