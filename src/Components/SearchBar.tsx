import { Search } from "lucide-react";
import { useSearch } from "../hooks/useSearch";
import { Lang, Ayah } from "../hooks/useAyah";

export default function SearchBar({ lang, setAyah }: { lang: Lang; setAyah: (a: Ayah) => void }) {
  const { query, setQuery, results, doSearch, setResults } = useSearch(lang);

  async function selectResult(item: Ayah) {
    setAyah(item);
    setResults([]);
    setQuery("");
  }

  return (
    <div className="relative mb-4">
      <input
        placeholder={`Search the Quran (${lang.toUpperCase()})…`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && doSearch()}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 pr-11 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/20"
      />
      <Search
        onClick={doSearch}
        className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer text-slate-400"
      />
      {results.length > 0 && (
        <div className="absolute mt-2 max-h-72 w-full overflow-auto rounded-xl border border-white/10 bg-[#0f1115] p-2 z-20">
          {results.map((r) => (
            <button
              key={r.key}
              className="w-full text-left rounded-lg px-3 py-2 hover:bg-white/5"
              onClick={() => selectResult(r)}
            >
              <div
                className="text-sm text-slate-200 line-clamp-1"
                dir={r.arabic ? "rtl" : "ltr"}
              >
                {r.arabic || r.translation}
              </div>
              <div className="text-xs text-slate-400">
                {r.surahName} • {r.key}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
