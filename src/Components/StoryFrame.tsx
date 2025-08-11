import React, { forwardRef } from "react";
import type { Ayah } from "../hooks/useAyah";

// I render a fixed 1080x1920 frame that looks clean on IG stories/reels.
// I keep it off-screen and snapshot it for PNG/MP4 export.
type Props = {
  ayah: Ayah;
  lang: "ar" | "en" | "fr";
  brand?: string;
  date?: string;
};

const StoryFrame = forwardRef<HTMLDivElement, Props>(
  ({ ayah, lang, brand = "dailyallah.app", date = new Date().toLocaleDateString() }, ref) => {
    return (
      <div ref={ref} style={{ width: 1080, height: 1920 }} className="relative overflow-hidden text-white">
        {/* base gradient – simple, modern, no distractions */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b0e12] via-[#0b0e12] to-[#0f172a]" />

        {/* very light dot pattern so the background doesn't feel dead */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "12px 12px" }}
        />

        {/* soft glows – barely there */}
        <div className="pointer-events-none absolute -top-40 -left-32 h-[560px] w-[560px] rounded-full blur-3xl opacity-15 bg-white" />
        <div className="pointer-events-none absolute -bottom-40 -right-32 h-[560px] w-[560px] rounded-full blur-3xl opacity-10 bg-white" />

        {/* safe content area with generous padding for stories */}
        <div className="relative z-10 h-full px-[72px] py-[80px] flex flex-col justify-between">
          {/* tiny header (surah + key) */}
          <div className="text-[30px] text-white/80 tracking-wide">
            {ayah.surahName} • {ayah.key}
          </div>

          {/* bismillah + Arabic + (optional) translation */}
          <div className="flex-1 mt-[30px]">
            <div className="text-center text-white/60 text-[26px] mb-[12px]">﷽</div>
            <div dir="rtl" className="font-arabic leading-[1.7] tracking-wide text-[58px]">
              {ayah.arabic}
            </div>

            {lang !== "ar" && (
              <div dir="ltr" className="mt-[28px] text-[32px] leading-[1.6] text-white/90">
                {ayah.translation}
              </div>
            )}
          </div>

          {/* footer – date + watermark */}
          <div className="flex items-center justify-between text-white/60">
            <div className="text-[28px]">{date}</div>
            <div className="text-[28px] tracking-widest">{brand}</div>
          </div>
        </div>
      </div>
    );
  }
);

export default StoryFrame;
