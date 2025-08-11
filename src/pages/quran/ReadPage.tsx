import { useEffect, useMemo, useRef, useState } from "react";
import { getChapters, getSurahVerses } from "../../api/quran";

const AR_NUM = "٠١٢٣٤٥٦٧٨٩";
const toArabicDigits = (n: number | string) =>
  String(n).replace(/\d/g, d => AR_NUM[Number(d)]);

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[\u064B-\u0652\u0670\u0640]/g, "");

export default function ReadPage() {
  const [chapters, setChapters] = useState<{id:number;name_simple:string;name_arabic:string}[]>([]);
  const [surah, setSurah] = useState<number>(1);
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(34);
  const [line, setLine] = useState(2.2);

  // search state
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => { getChapters().then(setChapters); }, []);
  useEffect(() => {
    setLoading(true);
    getSurahVerses(surah).then(setVerses).finally(()=>setLoading(false));
    // scroll to top when changing surah
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [surah]);

  const current = useMemo(() => chapters.find(c => c.id === surah), [chapters, surah]);

  const filtered = useMemo(() => {
    const n = normalize(q);
    if (!n) return [];
    return chapters.filter(c =>
      normalize(c.name_simple).includes(n) ||
      normalize(c.name_arabic).includes(n) ||
      String(c.id).includes(n)
    ).slice(0, 10);
  }, [q, chapters]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Prev / Next helpers
  const changeSurah = (delta: number) => {
    setSurah(s => Math.min(114, Math.max(1, s + delta)));
    setOpen(false);
    setQ("");
    setActive(0);
  };

  // Keyboard: ← / →
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const inForm =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          (el as any).isContentEditable);
      if (inForm) return;
      if (e.key === "ArrowLeft") changeSurah(-1);
      if (e.key === "ArrowRight") changeSurah(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function jumpTo(cId: number) {
    setSurah(cId);
    setQ("");
    setOpen(false);
    setActive(0);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(a => Math.min(a + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(a => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered.length) jumpTo(filtered[active]?.id);
      else {
        const id = Number(q);
        if (id >= 1 && id <= 114) jumpTo(id);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      {/* Sticky toolbar */}
      <div className="sticky top-16 z-10 -mx-4 sm:-mx-6 lg:-mx-8 border-y border-white/5 bg-[#0f1115]/70 backdrop-blur px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-3 flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div ref={boxRef} className="relative w-full max-w-md">
            <label className="sr-only" htmlFor="surah-search">Search surah</label>
            <input
              id="surah-search"
              value={q}
              onChange={e => { setQ(e.target.value); setOpen(true); setActive(0); }}
              onFocus={() => q && setOpen(true)}
              onKeyDown={onKeyDown}
              placeholder="Search surah (Arabic, English, or number)…"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-400 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            {open && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-white/10 bg-[#0f1115] shadow-xl">
                {filtered.length ? (
                  <ul className="max-h-72 overflow-y-auto py-1">
                    {filtered.map((c, i) => (
                      <li
                        key={c.id}
                        onMouseDown={(e)=>e.preventDefault()}
                        onClick={()=>jumpTo(c.id)}
                        onMouseEnter={()=>setActive(i)}
                        className={`px-3 py-2 cursor-pointer flex items-center justify-between ${i===active ? "bg-white/10" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-sm">
                            {toArabicDigits(c.id)}
                          </span>
                          <div className="leading-tight" dir="rtl">
                            <div className="text-slate-100">{c.name_arabic}</div>
                            <div className="text-xs text-slate-400" dir="ltr">{c.name_simple}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-3 py-3 text-sm text-slate-400">No results</div>
                )}
              </div>
            )}
          </div>

          {/* Prev / Next */}
          <div className="flex items-center gap-2">
            <button
              aria-label="Previous surah"
              onClick={() => changeSurah(-1)}
              disabled={surah <= 1}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <button
              aria-label="Next surah"
              onClick={() => changeSurah(1)}
              disabled={surah >= 114}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>

          {/* Text controls */}
          <div className="ml-auto flex items-center gap-2 text-sm text-slate-300">
            <span>Text</span>
            <input
              type="range"
              min={28}
              max={44}
              value={fontSize}
              onChange={e => setFontSize(+e.target.value)}
            />
            <span>Spacing</span>
            <input
              type="range"
              min={18}
              max={28}
              value={line * 10}
              onChange={e => setLine(+e.target.value / 10)}
            />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide text-slate-200">
          {current?.name_arabic} <span className="text-slate-400">/ {current?.name_simple}</span>
        </h1>
      </div>

      {/* Reader */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : (
          <div dir="rtl" style={{ fontSize: `${fontSize}px`, lineHeight: `${line}em` }}
               className="select-text text-slate-100">
            {verses.map((v:any) => (
              <div key={v.id} id={`v-${v.verse_key}`} className="flex flex-row-reverse items-start gap-3 py-2">
                <span className="flex-none inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/30 text-[0.9rem] text-slate-200 mt-[0.2em]">
                  {toArabicDigits(v.verse_number)}
                </span>
                <p className="flex-1 break-words">{v.text_uthmani}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

