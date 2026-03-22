import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import type { IataEntry } from "../types";

interface Props {
	onSearch:    (code: string) => void;
	loading:     boolean;
	suggestions: IataEntry[];
}

const MAX_SUGGESTIONS = 8;

export function SearchBar({ onSearch, loading, suggestions }: Props) {
	const [value, setValue]           = useState("");
	const [filtered, setFiltered]     = useState<IataEntry[]>([]);
	const [open, setOpen]             = useState(false);
	const [highlighted, setHighlighted] = useState(-1);
	const containerRef                = useRef<HTMLDivElement>(null);
	const justSelectedRef             = useRef(false);

	useEffect(() => {
		if (justSelectedRef.current) {
			justSelectedRef.current = false;
			return;
		}

		const query = value.trim().toUpperCase();

		if (query.length < 2) {
			setFiltered([]);
			setOpen(false);
			return;
		}

		const queryLower = query.toLowerCase();

		const SIZE_RANK: Record<string, number> = {
			large_airport:  0,
			medium_airport: 1,
			small_airport:  2,
		};

		function score(entry: IataEntry): number {
			if (entry.iata_code === query)
				return 0; // IATA exact

			if (entry.iata_code.startsWith(query))
				return 1; // IATA prefix

			if (entry.icao_code === query)
				return 2; // ICAO exact

			if (entry.icao_code.startsWith(query))
				return 3; // ICAO prefix

			if (entry.name.toLowerCase().startsWith(queryLower))
				return 4; // name prefix

			if (entry.name.toLowerCase().includes(queryLower))
				return 5; // name contains

			if (entry.municipality.toLowerCase().includes(queryLower))
				return 6; // city contains

			return Infinity;
		}

		const results = suggestions
			.map((entry) => ({ entry, rank: score(entry) }))
			.filter(({ rank }) => rank < Infinity)
			.sort((resultA, resultB) =>
				resultA.rank - resultB.rank ||
				(SIZE_RANK[resultA.entry.airport_type] ?? 3) - (SIZE_RANK[resultB.entry.airport_type] ?? 3) ||
				resultA.entry.iata_code.localeCompare(resultB.entry.iata_code)
			)
			.slice(0, MAX_SUGGESTIONS)
			.map(({ entry }) => entry);

		setFiltered(results);
		setOpen(results.length > 0);
		setHighlighted(-1);
	}, [value, suggestions]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node))
				setOpen(false);
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	function handleAction(formData: FormData) {
		const trimmed = (formData.get("search") as string ?? "").trim();

		if (trimmed) {
			setOpen(false);
			onSearch(trimmed);
		}
	}

	function handleSelect(entry: IataEntry) {
		justSelectedRef.current = true;
		setValue("");
		setOpen(false);
		onSearch(entry.iata_code);
	}

	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (!open)
			return;

		if (event.key === "ArrowDown") {
			event.preventDefault();
			setHighlighted((prev) => Math.min(prev + 1, filtered.length - 1));
		}

		if (event.key === "ArrowUp") {
			event.preventDefault();
			setHighlighted((prev) => Math.max(prev - 1, 0));
		}

		if (event.key === "Enter" && highlighted >= 0) {
			event.preventDefault();
			handleSelect(filtered[highlighted]);
		}

		if (event.key === "Escape") {
			setOpen(false);
			setHighlighted(-1);
		}
	}

	return (
		<div ref={containerRef} className="relative w-full max-w-lg">
			<form action={handleAction} className="flex gap-3">
				<input
					name="search"
					type="text"
					value={value}
					onChange={(e) => setValue(e.target.value.toUpperCase())}
					onKeyDown={handleKeyDown}
					onFocus={() => filtered.length > 0 && setOpen(true)}
					placeholder="Code IATA ou ICAO"
					maxLength={6}
					autoFocus
					autoComplete="off"
					spellCheck={false}
					className="
						flex-1 px-5 py-3 rounded-xl bg-slate-800 border border-slate-700
						text-slate-100 placeholder:text-slate-500 font-mono text-lg tracking-widest
						focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
						transition-colors
					"
				/>
				<button
					type="submit"
					disabled={loading || !value.trim()}
					className="
						px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold
						disabled:opacity-40 disabled:cursor-not-allowed transition-colors
					"
				>
					{loading ? "..." : "Lookup"}
				</button>
			</form>

			{/* Dropdown */}
			{open && (
				<ul className="
					absolute z-50 top-full mt-2 left-0 right-16
					bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden
				">
					{filtered.map((entry, index) => (
						<li key={entry.iata_code}>
							<button
								type="button"
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => handleSelect(entry)}
								className={`
									w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
									${index === highlighted ? "bg-sky-600/30 text-slate-100" : "hover:bg-slate-700 text-slate-300"}
								`}
							>
								<span className="font-mono font-bold text-sky-400 w-10 shrink-0">{entry.iata_code}</span>
								<span className="font-mono text-xs text-slate-500 w-12 shrink-0">{entry.icao_code !== "N/A" ? entry.icao_code : ""}</span>
								<span className="truncate text-sm">{entry.name}</span>
								<span className="text-xs text-slate-500 shrink-0 ml-auto">{entry.country_code}</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
