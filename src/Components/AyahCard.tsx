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

       <div className="mb-3 text-center text-slate-300/80 text-3xl">﷽</div>
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
