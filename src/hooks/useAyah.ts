import { useState, useEffect, useMemo } from "react";

export type Lang = "ar" | "en" | "fr";
export type Ayah = {
  key: string;
  surah: number;
  numberInSurah: number;
  surahName: string;
  arabic: string;
  translation: string;
};

const API_RANDOM_AR = "https://api.alquran.cloud/v1/ayah/random/ar.alafasy";
const TR_EDITION = {
  ar: "quran-uthmani",
  en: "en.sahih",
  fr: "fr.hamidullah",
};

const FALLBACK: Ayah = {
  key: "112:1",
  surah: 112,
  numberInSurah: 1,
  surahName: "Al-Ikhlas",
  arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌۭ",
  translation: "Say, He is Allah, [who is] One,",
};

export function useAyah() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [lang, setLang] = useState<Lang>("en");
  const [ayah, setAyah] = useState<Ayah>(FALLBACK);
  const [loading, setLoading] = useState(false);

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
      let translationText = "";

      if (targetLang !== "ar") {
        const trRes = await fetch(
          `https://api.alquran.cloud/v1/ayah/${key}/${TR_EDITION[targetLang]}?cb=${Date.now()}`
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
    if (newLang === "ar") {
      setAyah((a) => ({ ...a, translation: "" }));
      return;
    }
    const res = await fetch(
      `https://api.alquran.cloud/v1/ayah/${ayah.key}/${TR_EDITION[newLang]}`
    );
    const json = await res.json();
    const text = json?.data?.text || "";
    setAyah((a) => ({ ...a, translation: text }));
  }

  return { ayah, setAyah, lang, setLang, loading, refreshAyah, changeLang };
}
