import React, { useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw, Copy, Heart, Share2, Download, Search } from "lucide-react";
import * as htmlToImage from "html-to-image";

const API_RANDOM_AR = "https://api.alquran.cloud/v1/ayah/random/ar.alafasy";

const TR_EDITION = {
  ar: "quran-uthmani",
  en: "en.sahih",
  fr: "fr.hamidullah",
};
type Lang = keyof typeof TR_EDITION;

type Ayah = {
  key: string;
  surah: number;
  numberInSurah: number;
  surahName: string;
  arabic: string;
  translation: string;
};

const FALLBACK: Ayah = {
  key: "112:1",
  surah: 112,
  numberInSurah: 1,
  surahName: "Al-Ikhlas",
  arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌۭ",
  translation: "Say, He is Allah, [who is] One,",
};

export default function HeroSearch() {
  const [lang, setLang] = useState<Lang>("en");
  const [ayah, setAyah] = useState<Ayah>(FALLBACK);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Ayah[]>([]);
  const [favs, setFavs] = useState<Ayah[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("fav_ayahs") || "[]");
    } catch {
      return [];
    }
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    localStorage.setItem("fav_ayahs", JSON.stringify(favs));
  }, [favs]);

  useEffect(() => {
    const cached = localStorage.getItem("ayah_today");
    if (cached) {
      const obj = JSON.parse(cached);
      if (obj.date === today) {
        setAyah(obj.ayah);
        return;
      }
    }
    refreshAyah();
  }, []);

  async function refreshAyah(targetLang: Lang = lang) {
    setLoading(true);
    try {
      let nextAr: any = null;
      let key = "";
      let attempts = 0;
      const lastKey = ayah?.key;

      // I fetch a new random Arabic ayah, make sure it’s not cached, and avoid showing the same one twice in a row
      while (attempts < 3) {
        const arRes = await fetch(`${API_RANDOM_AR}?cb=${Date.now()}`, {
          cache: "no-store",
        });
        const arJson = await arRes.json();
        nextAr = arJson?.data;
        key = `${nextAr?.surah?.number}:${nextAr?.numberInSurah}`;
        if (key && key !== lastKey) break;
        attempts++;
      }

      const surahName = nextAr?.surah?.englishName || "Surah";

      // If the language isn’t Arabic, I grab its translation too
      let translationText = "";
      if (targetLang !== "ar") {
        const trRes = await fetch(
          `https://api.alquran.cloud/v1/ayah/${key}/${TR_EDITION[targetLang]}?cb=${Date.now()}`,
          { cache: "no-store" }
        );
        const trJson = await trRes.json();
        translationText = trJson?.data?.text || "";
      }

      const next: Ayah = {
        key,
        surah: nextAr?.surah?.number,
        numberInSurah: nextAr?.numberInSurah,
        surahName,
        arabic: nextAr?.text || FALLBACK.arabic,
        translation:
          translationText || (targetLang === "ar" ? "" : FALLBACK.translation),
      };

      setAyah(next);
      localStorage.setItem(
        "ayah_today",
        JSON.stringify({ date: today, ayah: next })
      );
    } catch {
      setAyah(FALLBACK);
    } finally {
      setLoading(false);
    }
  }

  async function changeLang(newLang: Lang) {
    setLang(newLang);

    // When switching to Arabic mode, I hide the translation
    if (newLang === "ar") {
      setAyah((a) => ({ ...a, translation: "" }));
      localStorage.setItem(
        "ayah_today",
        JSON.stringify({ date: today, ayah: { ...ayah, translation: "" } })
      );
      return;
    }

    // For other languages, I fetch the translation for the current ayah
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/ayah/${ayah.key}/${TR_EDITION[newLang]}`
      );
      const json = await res.json();
      const text = json?.data?.text || "";
      setAyah((a) => ({ ...a, translation: text }));
      localStorage.setItem(
        "ayah_today",
        JSON.stringify({ date: today, ayah: { ...ayah, translation: text } })
      );
    } catch {}
  }

  const hasArabic = (s: string) => /[\u0600-\u06FF]/.test(s);

  async function doSearch() {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // I pick the edition based on the current language or if the query has Arabic
    const ed =
      lang === "ar" || hasArabic(query) ? "quran-uthmani" : TR_EDITION[lang];

    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/search/${encodeURIComponent(
          query
        )}/all/${ed}`
      );
      const json = await res.json();
      const matches = (json?.data?.matches || [])
        .slice(0, 12)
        .map((m: any) => ({
          key: `${m.surah.number}:${m.numberInSurah}`,
          surah: m.surah.number,
          numberInSurah: m.numberInSurah,
          surahName: m.surah.englishName,
          arabic: ed === "quran-uthmani" ? m.text : "",
          translation: ed !== "quran-uthmani" ? m.text : "",
        })) as Ayah[];
      setResults(matches);
    } catch {
      setResults([]);
    }
  }

  async function selectResult(item: Ayah) {
    try {
      let arabicText = item.arabic;
      if (!arabicText) {
        const arRes = await fetch(
          `https://api.alquran.cloud/v1/ayah/${item.key}/quran-uthmani`
        );
        const arJson = await arRes.json();
        arabicText = arJson?.data?.text || "";
      }

      let translationText = item.translation;
      if (lang !== "ar" && !translationText) {
        const trRes = await fetch(
          `https://api.alquran.cloud/v1/ayah/${item.key}/${TR_EDITION[lang]}`
        );
        const trJson = await trRes.json();
        translationText = trJson?.data?.text || "";
      }

      setAyah({
        ...item,
        arabic: arabicText,
        translation: lang === "ar" ? "" : translationText,
      });
      setResults([]);
      setQuery("");
    } catch {}
  }

  function toggleFav() {
    const exists = favs.find((f) => f.key === ayah.key);
    if (exists) setFavs(favs.filter((f) => f.key !== ayah.key));
    else setFavs([{ ...ayah }, ...favs].slice(0, 100));
  }

  async function copyAyah() {
    const text = `${ayah.arabic}\n\n${ayah.translation}\n— ${ayah.surahName} ${
      ayah.key.split(":")[1]
    }`;
    await navigator.clipboard.writeText(text);
  }

  async function downloadPNG() {
    if (!cardRef.current) return;
    const dataUrl = await htmlToImage.toPng(cardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
    });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `ayah-${ayah.key.replace(":", "-")}.png`;
    a.click();
  }

  async function shareAyah() {
    const title = `${ayah.surahName} ${ayah.key.split(":")[1]}`;
    const text = `${ayah.arabic}\n\n${ayah.translation}\n— ${title}`;
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title: "Daily Ayah", text });
        return;
      } catch {}
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  const isFav = favs.some((f) => f.key === ayah.key);

  return (
    <div className="mx-auto w-full max-w-3xl">
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

      <div
        ref={cardRef}
        className="relative rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7 backdrop-blur-sm shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_20px_60px_-30px_rgba(0,0,0,0.8)]"
      >
        <div className="absolute bottom-3 right-4 text-[10px] tracking-wider text-white/40 select-none">
          dailyallah.app
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-sm text-slate-300">
            {ayah.surahName} • {ayah.key}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={lang}
              onChange={(e) => changeLang(e.target.value as Lang)}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-100"
            >
              <option
                value="ar"
                className="bg-[#0f1115] text-slate-100 hover:bg-white/10"
              >
                العربية
              </option>
              <option
                value="en"
                className="bg-[#0f1115] text-slate-100 hover:bg-white/10"
              >
                English
              </option>
              <option
                value="fr"
                className="bg-[#0f1115] text-slate-100 hover:bg-white/10"
              >
                Français
              </option>
            </select>
            <button
              onClick={() => refreshAyah(lang)}
              disabled={loading}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-50"
              title="New random ayah"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>

        <div className="mb-3 text-center text-slate-300/80 text-xs">﷽</div>

        <div
          dir="rtl"
          className="font-arabic text-2xl sm:text-3xl leading-[1.6] tracking-wide text-slate-50"
        >
          {ayah.arabic}
        </div>

        {lang !== "ar" && (
          <div
            dir="ltr"
            className="mt-4 text-base sm:text-lg leading-relaxed text-slate-200"
          >
            {ayah.translation}
          </div>
        )}

        <div className="mt-3 text-xs text-slate-400">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={copyAyah}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
        >
          <Copy className="h-4 w-4" /> Copy
        </button>
        <button
          onClick={toggleFav}
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 hover:bg-white/10 ${
            isFav
              ? "border-rose-400/30 bg-rose-400/10"
              : "border-white/10 bg-white/5"
          }`}
        >
          <Heart
            className={`h-4 w-4 ${isFav ? "fill-current text-rose-300" : ""}`}
          />{" "}
          Favorite
        </button>
        <button
          onClick={shareAyah}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
        >
          <Share2 className="h-4 w-4" /> Share
        </button>
        <button
          onClick={downloadPNG}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
        >
          <Download className="h-4 w-4" /> Download
        </button>
      </div>

      {favs.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 text-sm text-slate-300">Favorites</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {favs.slice(0, 6).map((f) => (
              <button
                key={f.key}
                onClick={() => setAyah(f)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left hover:bg-white/10"
                title={`${f.surahName} ${f.key}`}
              >
                <div className="text-xs text-slate-400">
                  {f.surahName} • {f.key}
                </div>
                <div dir="rtl" className="font-arabic text-base line-clamp-1">
                  {f.arabic}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
