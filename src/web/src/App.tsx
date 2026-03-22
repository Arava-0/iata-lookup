import { useState, useEffect } from "react";
import { SearchBar }     from "./components/SearchBar";
import { AirportHeader } from "./components/AirportHeader";
import { RunwayList }    from "./components/RunwayList";
import { FrequencyList } from "./components/FrequencyList";
import { NavaidList }    from "./components/NavaidList";
import { EmptyState }    from "./components/EmptyState";
import { lookupAirport, getRunways, getFrequencies, getNavaids } from "./api";
import type { Airport, Frequency, IataEntry, Navaid, Runway } from "./types";

type Tab = "runways" | "frequencies" | "navaids";

interface AirportData {
	airport:     Airport;
	runways:     Runway[];
	frequencies: Frequency[];
	navaids:     Navaid[];
}

const TABS: { id: Tab; label: string }[] = [
	{ id: "runways",     label: "Pistes"      },
	{ id: "frequencies", label: "Fréquences"  },
	{ id: "navaids",     label: "Navaids"     },
];

export function App() {
	const [loading, setLoading]       = useState(false);
	const [error, setError]           = useState<string | null>(null);
	const [data, setData]             = useState<AirportData | null>(null);
	const [activeTab, setActiveTab]   = useState<Tab>("runways");
	const [iataList, setIataList]     = useState<IataEntry[]>([]);
	const [lastSync, setLastSync]     = useState<string | null>(null);

	useEffect(() => {
		fetch("/api/iata")
			.then((res) => res.json())
			.then((list: IataEntry[]) => setIataList(list))
			.catch(() => {});

		fetch("/api/health")
			.then((res) => res.json())
			.then((json: { last_sync: string | null }) => setLastSync(json.last_sync))
			.catch(() => {});
	}, []);

	async function handleSearch(code: string) {
		setLoading(true);
		setError(null);
		setData(null);

		try {
			const airport = await lookupAirport(code);

			const [runways, frequencies, navaids] = await Promise.all([
				getRunways(airport.ident),
				getFrequencies(airport.ident),
				getNavaids(airport.ident),
			]);

			setData({ airport, runways, frequencies, navaids });
			setActiveTab("runways");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Aéroport introuvable.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex flex-col items-center px-4 py-12 gap-8">

			{/* Header */}
			<div className="flex flex-col items-center gap-2 text-center">
				<span className="text-4xl select-none">✈</span>
				<h1 className="text-3xl font-bold text-slate-50 tracking-tight">IATA Lookup</h1>
				<p className="text-slate-400 text-sm">Recherchez un aéroport par code IATA ou ICAO</p>
			</div>

			<SearchBar onSearch={handleSearch} loading={loading} suggestions={iataList} />

			{/* Error */}
			{error && (
				<div className="w-full max-w-4xl bg-red-900/30 border border-red-700 rounded-xl px-5 py-4 text-red-300 text-sm">
					{error}
				</div>
			)}

			{/* Empty state */}
			{!data && !loading && !error && (
				<EmptyState onSelect={handleSearch} />
			)}

			{/* Results */}
			{data && (
				<div className="w-full max-w-4xl space-y-4">
					<AirportHeader airport={data.airport} />

					{/* Tabs */}
					<div className="flex gap-1 bg-slate-900 border border-slate-700 rounded-xl p-1 w-fit">
						{TABS.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`
									px-4 py-2 rounded-lg text-sm font-medium transition-colors
									${activeTab === tab.id
										? "bg-sky-600 text-white"
										: "text-slate-400 hover:text-slate-200"}
								`}
							>
								{tab.label}
								<Count value={
									tab.id === "runways"     ? data.runways.length     :
									tab.id === "frequencies" ? data.frequencies.length :
									data.navaids.length
								} />
							</button>
						))}
					</div>

					{/* Tab content */}
					<div>
						{activeTab === "runways"     && <RunwayList    runways={data.runways} />}
						{activeTab === "frequencies" && <FrequencyList frequencies={data.frequencies} />}
						{activeTab === "navaids"     && <NavaidList    navaids={data.navaids} />}
					</div>
				</div>
			)}

			{/* Footer */}
			<footer className="mt-auto pt-12 text-center text-xs text-slate-700 space-y-1">
				<p>
					Service proposé par <span className="text-slate-500 font-medium">DBY-FLY Group</span>
					<span className="mx-2">·</span>
					Données <a href="https://ourairports.com" target="_blank" rel="noreferrer" className="hover:text-slate-400 transition-colors">OurAirports</a>
				</p>
				{lastSync && (
					<p>
						Dernière mise à jour des données&nbsp;:&nbsp;
						<span className="text-slate-500">
							{new Date(lastSync).toLocaleString("fr-FR", {
								day:    "2-digit",
								month:  "2-digit",
								year:   "numeric",
								hour:   "2-digit",
								minute: "2-digit",
							})}
						</span>
					</p>
				)}
			</footer>
		</div>
	);
}

function Count({ value }: { value: number }) {
	if (value === 0)
		return null;

	return (
		<span className="ml-2 text-xs bg-slate-700 text-slate-300 rounded-full px-1.5 py-0.5">
			{value}
		</span>
	);
}
