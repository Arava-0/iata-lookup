import type { Navaid } from "../types";

const TYPE_STYLE: Record<string, string> = {
	VOR:    "bg-sky-900/50 text-sky-300 border-sky-800",
	VORDME: "bg-blue-900/50 text-blue-300 border-blue-800",
	NDB:    "bg-violet-900/50 text-violet-300 border-violet-800",
	ILS:    "bg-emerald-900/50 text-emerald-300 border-emerald-800",
	LOC:    "bg-teal-900/50 text-teal-300 border-teal-800",
	DME:    "bg-amber-900/50 text-amber-300 border-amber-800",
	TACAN:  "bg-orange-900/50 text-orange-300 border-orange-800",
};

interface Props {
	navaids: Navaid[];
}

export function NavaidList({ navaids }: Props) {
	if (navaids.length === 0)
		return <p className="text-slate-500 text-sm py-4 text-center">Aucune aide à la navigation enregistrée pour cet aéroport.</p>;

	return (
		<div className="space-y-3">
			{navaids.map((navaid) => {
				const freqMhz = navaid.frequency_khz
					? `${(parseInt(navaid.frequency_khz) / 1000).toFixed(2)} MHz`
					: "—";

				return (
					<div key={navaid.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">

						{/* Header */}
						<div className="flex items-center gap-3 flex-wrap">
							<span className={`text-xs font-bold px-2 py-0.5 rounded border ${TYPE_STYLE[navaid.type] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}>
								{navaid.type}
							</span>
							<span className="font-mono font-bold text-sky-400 text-lg">{navaid.ident}</span>
							<span className="text-slate-300 text-sm">{navaid.name}</span>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
							<Stat label="Fréquence" value={freqMhz} mono />
							<Stat label="Puissance"  value={navaid.power || "—"} />
							<Stat label="Usage"      value={navaid.usageType || "—"} />
						</div>
					</div>
				);
			})}
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
