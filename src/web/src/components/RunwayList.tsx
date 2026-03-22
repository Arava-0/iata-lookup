import type { Runway } from "../types";

const SURFACE_LABEL: Record<string, string> = {
	ASP: "Asphalt",  CON: "Concrete",  GRS: "Grass",
	GRE: "Gravel",   TURF: "Turf",     DIRT: "Dirt",
	WATER: "Water",  CLA: "Clay",      SAND: "Sand",
};

interface Props {
	runways: Runway[];
}

export function RunwayList({ runways }: Props) {
	if (runways.length === 0)
		return <Empty message="Aucune piste enregistrée pour cet aéroport." />;

	return (
		<div className="space-y-3">
			{runways.map((runway) => (
				<div key={runway.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">

					{/* Header */}
					<div className="flex items-center justify-between flex-wrap gap-2">
						<span className="font-mono font-bold text-sky-400 text-lg">
							{runway.le_ident} / {runway.he_ident}
						</span>
						<div className="flex gap-2 flex-wrap">
							<Badge>{SURFACE_LABEL[runway.surface] ?? (runway.surface || "—")}</Badge>
							{runway.lighted === "1" && <Badge color="amber">Éclairée</Badge>}
							{runway.closed  === "1" && <Badge color="red">Fermée</Badge>}
						</div>
					</div>

					{/* Dimensions */}
					<div className="flex gap-6 text-sm text-slate-300">
						{runway.length_ft && (
							<span>
								<span className="text-slate-500">Longueur </span>
								<span className="font-mono font-medium">{Number(runway.length_ft).toLocaleString()} ft</span>
							</span>
						)}
						{runway.width_ft && (
							<span>
								<span className="text-slate-500">Largeur </span>
								<span className="font-mono font-medium">{runway.width_ft} ft</span>
							</span>
						)}
					</div>

					{/* Ends */}
					<div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
						<RunwayEnd label="Low End" ident={runway.le_ident} heading={runway.le_heading_degT} elevation={runway.le_elevation_ft} displaced={runway.le_displaced_threshold_ft} />
						<RunwayEnd label="High End" ident={runway.he_ident} heading={runway.he_heading_degT} elevation={runway.he_elevation_ft} displaced={runway.he_displaced_threshold_ft} />
					</div>
				</div>
			))}
		</div>
	);
}

function RunwayEnd({ label, ident, heading, elevation, displaced }: {
	label:     string;
	ident:     string;
	heading:   string;
	elevation: string;
	displaced: string;
}) {
	return (
		<div className="space-y-1">
			<p className="text-xs text-slate-500 uppercase tracking-wider">{label} — <span className="font-mono text-slate-300">{ident}</span></p>
			{heading   && <p className="text-sm text-slate-400">Cap <span className="font-mono text-slate-200">{heading}°</span></p>}
			{elevation && <p className="text-sm text-slate-400">Altitude <span className="font-mono text-slate-200">{elevation} ft</span></p>}
			{displaced && <p className="text-sm text-slate-400">Displaced <span className="font-mono text-slate-200">{displaced} ft</span></p>}
		</div>
	);
}

function Badge({ children, color = "slate" }: { children: React.ReactNode; color?: "slate" | "amber" | "red" }) {
	const styles = {
		slate: "bg-slate-800 text-slate-300 border-slate-700",
		amber: "bg-amber-900/50 text-amber-300 border-amber-700",
		red:   "bg-red-900/50 text-red-300 border-red-700",
	};

	return (
		<span className={`text-xs px-2 py-0.5 rounded border ${styles[color]}`}>
			{children}
		</span>
	);
}

function Empty({ message }: { message: string }) {
	return (
		<p className="text-slate-500 text-sm py-4 text-center">{message}</p>
	);
}
