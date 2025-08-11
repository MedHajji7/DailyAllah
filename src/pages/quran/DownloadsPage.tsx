// import { useEffect, useState } from "react";
// import { listReciters, getChapterMp3, getSurahAyahAudio } from "../../api/quran";
// import { useSearchParams } from "react-router-dom";

// export default function DownloadsPage() {
//   const [searchParams] = useSearchParams();

//   const [reciters, setReciters] = useState<{ id: number; name: string }[]>([]);
//   const [reciterId, setReciterId] = useState<number | undefined>(undefined);
//   const [surah, setSurah] = useState<number>(1);

//   const [url, setUrl] = useState<string>("");
//   const [ayahLinks, setAyahLinks] = useState<{ verse_key: string; url: string }[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string>("");

//   useEffect(() => { listReciters().then(setReciters); }, []);

//   // Core fetch, parameterized (don’t rely on possibly stale state)
//   async function fetchLink(rid: number, s: number) {
//     setLoading(true);
//     setError("");
//     setUrl("");
//     setAyahLinks([]);
//     try {
//       const mp3 = await getChapterMp3(rid, s);
//       if (mp3) { setUrl(mp3); return; }
//       const files = await getSurahAyahAudio(rid, s);
//       setAyahLinks(files);
//       setError("This reciter has no single-file MP3 for this sūrah. Use the ayah links below or choose another reciter.");
//     } catch (e: any) {
//       setError(e?.message || "Failed to fetch audio.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Auto-fill from ?reciter=&surah= and fetch once
//   useEffect(() => {
//     const r = Number(searchParams.get("reciter"));
//     const s = Number(searchParams.get("surah"));
//     if (r && s) {
//       setReciterId(r);
//       setSurah(s);
//       fetchLink(r, s);
//     }
//     // run once on mount
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Click handler using current state
//   const onGetLink = () => {
//     if (!reciterId) return;
//     fetchLink(reciterId, surah);
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-wrap items-center gap-3">
//         <select
//           value={reciterId ?? ""}
//           onChange={(e) => setReciterId(Number(e.target.value))}
//           style={{ colorScheme: "dark" }}
//           className="bg-white/5 border border-white/10 rounded px-3 py-2"
//         >
//           <option value="">Choose reciter</option>
//           {reciters.map((r) => (
//             <option key={r.id} value={r.id}>{r.name}</option>
//           ))}
//         </select>

//         <input
//           type="number"
//           min={1}
//           max={114}
//           value={surah}
//           onChange={(e) => setSurah(+e.target.value)}
//           className="bg-white/5 border border-white/10 rounded px-3 py-2 w-24"
//         />

//         <button
//           onClick={onGetLink}
//           disabled={!reciterId || loading}
//           className="rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/5 disabled:opacity-40"
//         >
//           {loading ? "Loading…" : "Get link"}
//         </button>
//       </div>

//       {error && <p className="text-sm text-amber-300">{error}</p>}

//       {url && (
//         <a href={url} download={`surah-${surah}.mp3`} className="underline">
//           Download Surah {surah} MP3
//         </a>
//       )}

//       {ayahLinks.length > 0 && (
//         <div className="space-y-2">
//           <p className="text-sm text-slate-300">Per-ayah files for Surah {surah}:</p>
//           <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
//             {ayahLinks.map((a, i) => (
//               <a
//                 key={a.verse_key}
//                 href={a.url}
//                 download={`surah-${surah}-ayah-${i + 1}.mp3`}
//                 className="text-xs px-2 py-1 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-center"
//                 title={a.verse_key}
//               >
//                 Ayah {i + 1}
//               </a>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
