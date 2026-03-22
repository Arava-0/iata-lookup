interface Props {
	onSelect: (code: string) => void;
}

const EXAMPLES = ["CDG", "LFPG", "JFK", "LHR", "DXB", "NRT", "SYD", "GVA"];

const STATS = [
	{ value: "9 000+",  label: "Aéroports IATA" },
	{ value: "249",     label: "Pays couverts"   },
	{ value: "47 000+", label: "Pistes"           },
	{ value: "30 000+", label: "Fréquences radio" },
];

export function EmptyState({ onSelect }: Props) {
	return (
		<div className="w-full max-w-4xl flex flex-col items-center gap-10 pt-4">

			{/* Visual */}
			<div className="flex flex-col items-center gap-3 text-center">
				<div className="text-6xl select-none opacity-20">🌍</div>
				<p className="text-slate-500 text-sm max-w-xs">
					Saisissez un code IATA <span className="font-mono text-slate-400">CDG</span> ou
					ICAO <span className="font-mono text-slate-400">LFPG</span> pour obtenir toutes
					les informations d'un aéroport.
				</p>
			</div>

			{/* Clickable examples */}
			<div className="flex flex-col items-center gap-3">
				<p className="text-xs text-slate-600 uppercase tracking-widest">Exemples</p>
				<div className="flex flex-wrap justify-center gap-2">
					{EXAMPLES.map((code) => (
						<button
							key={code}
							onClick={() => onSelect(code)}
							className="
								font-mono text-sm px-4 py-1.5 rounded-lg
								bg-slate-800 hover:bg-slate-700 border border-slate-700
								hover:border-sky-600 text-slate-300 hover:text-sky-300
								transition-all
							"
						>
							{code}
						</button>
					))}
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
				{STATS.map((stat) => (
					<div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
						<p className="text-2xl font-bold text-sky-400">{stat.value}</p>
						<p className="text-xs text-slate-500 mt-1">{stat.label}</p>
					</div>
				))}
			</div>
		</div>
	);
}
