// const API = 'https://api.quran.com/api/v4';

// export type Reciter = { id: number; name: string };

// export async function listReciters(): Promise<Reciter[]> {
//   const r = await fetch(`${API}/resources/recitations?language=en`).then(x=>x.json());
//   return (r.recitations ?? []).map((x:any)=>({ id:x.id, name: x.reciter_name }));
// }

// // src/api/quran.ts
// export async function getChapters() {
//   const r = await fetch(`https://api.quran.com/api/v4/chapters?language=en`).then(x=>x.json());
//   return r.chapters as Array<{ id:number; name_simple:string; name_arabic:string }>;
// }


// export async function getSurahVerses(surah: number, field = "text_uthmani") {
//   const url = `${API}/verses/by_chapter/${surah}?words=false&fields=${field}&per_page=300`;
//   const r = await fetch(url).then(x => x.json());
//   return r.verses as any[];
// }


// // One MP3 per chapter + per-ayah segments
// export async function getChapterAudio(recitationId:number, chapterId:number) {
//   const r = await fetch(`${API}/recitations/${recitationId}/by_chapter/${chapterId}?segments=true`)
//     .then(x=>x.json());
//   return r.audio_files?.[0] as { audio_url:string; segments:number[][] } | undefined;
// }


// src/api/quran.ts
const API = "https://api.quran.com/api/v4";

/* ---------- Types ---------- */
export type Reciter = { id: number; name: string };

export type Chapter = {
  id: number;
  name_simple: string;
  name_arabic: string;
};

export type Verse = {
  id: number;
  verse_key: string;      // e.g., "2:255"
  verse_number: number;   // number within surah
  text_uthmani: string;
};

type Pagination = { next_page: number | null };

type AyahAudioFile = {
  verse_key: string;
  url: string;            // absolute URL (usually https://audio.qurancdn.com/…)
};

type ChapterMp3Response = {
  audio_file?: { audio_url?: string };
};

type ChapterListResponse = { chapters: Chapter[] };
type VersesResponse = { verses: Verse[] };
type RecitationsResponse = { recitations: Array<{ id: number; reciter_name: string }> };
type AyahAudioResponse = { audio_files: AyahAudioFile[]; pagination?: Pagination };

/* ---------- Helpers ---------- */
async function fetchJSON<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json() as Promise<T>;
}

function normalizeUrl(u: string): string {
  if (!u) return u;
  if (u.startsWith("http")) return u;
  if (u.startsWith("//")) return "https:" + u;
  return u; // API usually returns absolute; keep as-is if path
}

/* ---------- Public API ---------- */

// Reciters list (id + display name)
export async function listReciters(): Promise<Reciter[]> {
  const r = await fetchJSON<RecitationsResponse>(`${API}/resources/recitations?language=en`);
  return (r.recitations ?? []).map(x => ({ id: x.id, name: x.reciter_name }));
}

// Chapters (Arabic + English names)
export async function getChapters(): Promise<Chapter[]> {
  const r = await fetchJSON<ChapterListResponse>(`${API}/chapters?language=en`);
  return r.chapters;
}

// Full surah verses (Arabic Uthmani)
export async function getSurahVerses(surah: number, field = "text_uthmani"): Promise<Verse[]> {
  // per_page=300 covers the longest surah
  const url = `${API}/verses/by_chapter/${surah}?words=false&fields=${field}&per_page=300`;
  const r = await fetchJSON<VersesResponse>(url);
  return r.verses;
}

// Per-ayah audio for a surah (fetch all pages)
export async function getSurahAyahAudio(
  recitationId: number,
  chapter: number
): Promise<AyahAudioFile[]> {
  const out: AyahAudioFile[] = [];
  let page = 1;
  while (true) {
    const url = `${API}/recitations/${recitationId}/by_chapter/${chapter}?page=${page}`;
    const r = await fetchJSON<AyahAudioResponse>(url);
    const files = (r.audio_files ?? []).map(a => ({ ...a, url: normalizeUrl(a.url) }));
    out.push(...files);

    const next = r.pagination?.next_page ?? null;
    if (!next) break;
    page = next;
  }
  return out;
}

// Optional: single MP3 for whole chapter (no per-ayah control)
export async function getChapterMp3(
  recitationId: number,
  chapter: number
): Promise<string | undefined> {
  const url = `${API}/chapter_recitations/${recitationId}/${chapter}`;
  const r = await fetchJSON<ChapterMp3Response>(url);
  return r.audio_file?.audio_url ? normalizeUrl(r.audio_file.audio_url) : undefined;
}
