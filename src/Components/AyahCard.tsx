 import LanguageSelector from "./LanguageSelector";
 import { Ayah, Lang } from "../hooks/useAyah";
 import AudioPlayer from "./AudioPlayer";

 export default function AyahCard({
   ayah,
   lang,
   setLang,
   loading,
   refreshAyah,
   changeLang
 }: {
   ayah: Ayah;
   lang: Lang;
   setLang: (l: Lang) => void;
   loading: boolean;
   refreshAyah: (l?: Lang) => void;
   changeLang: (l: Lang) => void;
 }) {
   return (
     <div
       className="relative rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7 backdrop-blur-sm shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_20px_60px_-30px_rgba(0,0,0,0.8)]"
     >
       <div className="absolute bottom-3 right-4 text-[10px] tracking-wider text-white/40 select-none">
         dailyallah.app
       </div>

       <div className="mb-4 flex items-center justify-between gap-3">
         <div className="text-sm text-slate-300">
           {ayah.surahName} • {ayah.key}
         </div>
         <LanguageSelector lang={lang} changeLang={changeLang} refreshAyah={refreshAyah} loading={loading} />
       </div>

       <div className="mb-3 text-center text-slate-300/80 text-xs">﷽</div>
       <div dir="rtl" className="font-arabic text-2xl sm:text-3xl leading-[1.6] tracking-wide text-slate-50">
         {ayah.arabic}
       </div>

       {lang !== "ar" && (
         <div dir="ltr" className="mt-4 text-base sm:text-lg leading-relaxed text-slate-200">
           {ayah.translation}
         </div>
       )}

       <AudioPlayer ayah={ayah} />

       <div className="mt-3 text-xs text-slate-400">{new Date().toLocaleDateString()}</div>
     </div>
   );
 }





// import { useEffect, useRef, useState } from "react";
// import { Download } from "lucide-react";
// import StoryFrame from "./StoryFrame";
// import { exportStoryMP4, exportStoryPNG } from "../hooks/useExporter";
// import type { Ayah, Lang } from "../hooks/useAyah";

// export default function AyahCard({
//   ayah, lang, setLang, loading, refreshAyah, changeLang
// }: {
//   ayah: Ayah;
//   lang: Lang;
//   setLang: (l: Lang) => void;
//   loading: boolean;
//   refreshAyah: (l?: Lang) => void;
//   changeLang: (l: Lang) => void;
// }) {
//   // I keep a hidden story frame to snapshot (PNG/MP4).
//   const storyRef = useRef<HTMLDivElement>(null);

//   // I grab Al-Afasy audio once the ayah changes to build MP4 later.
//   const [audioUrl, setAudioUrl] = useState("");
//   useEffect(() => {
//     if (!ayah.key) return;
//     (async () => {
//       try {
//         const r = await fetch(`https://api.alquran.cloud/v1/ayah/${ayah.key}/ar.alafasy`);
//         const j = await r.json();
//         setAudioUrl(j?.data?.audio || "");
//       } catch {
//         setAudioUrl("");
//       }
//     })();
//   }, [ayah.key]);

//   async function handleStoryPNG() {
//     if (!storyRef.current) return;
//     await exportStoryPNG(storyRef.current);
//   }

//   async function handleStoryMP4() {
//     if (!storyRef.current || !audioUrl) return;
//     // IG stories split each 15s chunk; 30s here is a sensible default for a reel/story.
//     await exportStoryMP4(storyRef.current, audioUrl, 30);
//   }

//   return (
//     <div
//       className="relative rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7 backdrop-blur-sm shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_20px_60px_-30px_rgba(0,0,0,0.8)]"
//     >
//       <div className="absolute bottom-3 right-4 text-[10px] tracking-wider text-white/40 select-none">
//         dailyallah.app
//       </div>

//       {/* header */}
//       <div className="mb-4 flex items-center justify-between gap-3">
//         <div className="text-sm text-slate-300">
//           {ayah.surahName} • {ayah.key}
//         </div>

//         {/* language + refresh – I keep it as you already have it */}
//         <div className="flex items-center gap-2">
//           <select
//             value={lang}
//             onChange={(e) => changeLang(e.target.value as Lang)}
//             className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-100"
//           >
//             <option value="ar">العربية</option>
//             <option value="en">English</option>
//             <option value="fr">Français</option>
//           </select>

//           <button
//             onClick={() => refreshAyah(lang)}
//             disabled={loading}
//             className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-50"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* body */}
//       <div className="mb-3 text-center text-slate-300/80 text-xs">﷽</div>

//       <div dir="rtl" className="font-arabic text-2xl sm:text-3xl leading-[1.6] tracking-wide text-slate-50">
//         {ayah.arabic}
//       </div>

//       {lang !== "ar" && (
//         <div dir="ltr" className="mt-4 text-base sm:text-lg leading-relaxed text-slate-200">
//           {ayah.translation}
//         </div>
//       )}

//       <div className="mt-3 text-xs text-slate-400">{new Date().toLocaleDateString()}</div>

//       {/* export actions – story image / story video */}
//       {/* <div className="mt-4 flex gap-2">
//         <button
//           onClick={handleStoryPNG}
//           className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
//           title="Export 1080x1920 PNG"
//         >
//           <Download className="h-4 w-4" /> Story PNG
//         </button>

//         {/* <button
//           onClick={handleStoryMP4}
//           disabled={!audioUrl}
//           className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 disabled:opacity-50"
//           title="Export 1080x1920 MP4 with audio"
//         >
//           <Download className="h-4 w-4" /> Story MP4
//         </button> 
//       </div>  */}

//       {/* hidden frame I snapshot – rendered off-screen so html-to-image can see it */}
//       <div className="sr-only absolute -left-[9999px] top-0">
//         <StoryFrame ref={storyRef} ayah={ayah} lang={lang} />
//       </div>
//     </div>
//   );
// }
