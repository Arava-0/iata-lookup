import type { Frequency } from "../types";

const TYPE_STYLE: Record<string, string> = {
	TWR:  "bg-red-900/50 text-red-300 border-red-800",
	APP:  "bg-orange-900/50 text-orange-300 border-orange-800",
	DEP:  "bg-yellow-900/50 text-yellow-300 border-yellow-800",
	GND:  "bg-sky-900/50 text-sky-300 border-sky-800",
	ATIS: "bg-violet-900/50 text-violet-300 border-violet-800",
	CTAF: "bg-emerald-900/50 text-emerald-300 border-emerald-800",
	UNIC: "bg-teal-900/50 text-teal-300 border-teal-800",
};

interface Props {
	frequencies: Frequency[];
}

export function FrequencyList({ frequencies }: Props) {
	if (frequencies.length === 0)
		return <p className="text-slate-500 text-sm py-4 text-center">Aucune fréquence enregistrée pour cet aéroport.</p>;

	const sorted = [...frequencies].sort((freqA, freqB) =>
		freqA.type.localeCompare(freqB.type)
	);

	return (
		<div className="overflow-hidden rounded-xl border border-slate-700">
			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-slate-700 bg-slate-900/80">
						<Th>Type</Th>
						<Th>Description</Th>
						<Th align="right">MHz</Th>
					</tr>
				</thead>
				<tbody>
					{sorted.map((freq) => (
						<tr key={freq.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors">
							<td className="px-4 py-3">
								<span className={`text-xs font-bold px-2 py-0.5 rounded border ${TYPE_STYLE[freq.type] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}>
									{freq.type}
								</span>
							</td>
							<td className="px-4 py-3 text-slate-300">{freq.description || "—"}</td>
							<td className="px-4 py-3 text-right font-mono font-semibold text-sky-400">{freq.frequency_mhz}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
	return (
		<th className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-${align}`}>
			{children}
		</th>
	);
}
