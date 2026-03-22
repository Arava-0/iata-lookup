import type { Airport } from "../types";

const AIRPORT_TYPE_LABEL: Record<string, string> = {
	large_airport:  "Large Airport",
	medium_airport: "Medium Airport",
	small_airport:  "Small Airport",
	heliport:       "Heliport",
	seaplane_base:  "Seaplane Base",
	balloonport:    "Balloonport",
	closed:         "Closed",
};

interface Props {
	airport: Airport;
}

export function AirportHeader({ airport }: Props) {
	const lat = parseFloat(airport.latitude_deg).toFixed(4);
	const lon = parseFloat(airport.longitude_deg).toFixed(4);
	const latLabel = parseFloat(lat) >= 0 ? `${lat}°N` : `${Math.abs(parseFloat(lat))}°S`;
	const lonLabel = parseFloat(lon) >= 0 ? `${lon}°E` : `${Math.abs(parseFloat(lon))}°W`;

	return (
		<div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">

			{/* Name */}
			<h1 className="text-2xl font-bold text-slate-50">{airport.name}</h1>

			{/* Codes + type */}
			<div className="flex flex-wrap items-center gap-3">
				{airport.iata_code && (
					<span className="font-mono text-xl font-bold text-sky-400">{airport.iata_code}</span>
				)}
				{airport.icao_code && (
					<span className="font-mono text-xl font-bold text-slate-300">{airport.icao_code}</span>
				)}
				<span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
					{AIRPORT_TYPE_LABEL[airport.type] ?? airport.type}
				</span>
				{airport.scheduled_service === "yes" && (
					<span className="text-xs px-2 py-1 rounded bg-emerald-900/50 text-emerald-400 border border-emerald-800"
						title="Cet aéroport opère des vols commerciaux réguliers (compagnies de ligne)">
						Vols réguliers ✓
					</span>
				)}
			</div>

			{/* Location grid */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-800">
				<Stat label="Country"   value={airport.iso_country} />
				<Stat label="City"      value={airport.municipality || "—"} />
				<Stat label="Elevation" value={airport.elevation_ft ? `${airport.elevation_ft} ft` : "—"} />
				<Stat label="Coords"    value={`${latLabel} ${lonLabel}`} mono />
			</div>

			{/* Links */}
			{(airport.home_link || airport.wikipedia_link) && (
				<div className="flex gap-4 pt-1">
					{airport.home_link && (
						<a href={airport.home_link} target="_blank" rel="noreferrer"
							className="text-sm text-sky-500 hover:text-sky-400 underline transition-colors">
							Site officiel
						</a>
					)}
					{airport.wikipedia_link && (
						<a href={airport.wikipedia_link} target="_blank" rel="noreferrer"
							className="text-sm text-sky-500 hover:text-sky-400 underline transition-colors">
							Wikipedia
						</a>
					)}
				</div>
			)}
		</div>
	);
}

function Stat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
	return (
		<div className="space-y-1">
			<p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
			<p className={`text-sm text-slate-200 ${mono ? "font-mono" : "font-medium"}`}>{value}</p>
		</div>
	);
}
