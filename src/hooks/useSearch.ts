import { useState } from "react";
import { Ayah, Lang } from "./useAyah";

const TR_EDITION = {
  ar: "quran-uthmani",
  en: "en.sahih",
  fr: "fr.hamidullah",
};

export function useSearch(lang: Lang) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Ayah[]>([]);

  const hasArabic = (s: string) => /[\u0600-\u06FF]/.test(s);

  async function doSearch() {
    if (!query.trim()) return setResults([]);

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
        }));
      setResults(matches);
    } catch {
      setResults([]);
    }
  }

  return { query, setQuery, results, doSearch, setResults };
}
