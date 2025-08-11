export default function Background({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh md:min-h-screen w-full overflow-x-clip text-slate-100 selection:bg-green-600/30 selection:text-white">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(1200px 600px at 50% -10%, rgba(15,23,42,.6), transparent 70%), radial-gradient(900px 500px at 100% 0%, rgba(22,101,52,.10), transparent 60%), radial-gradient(900px 500px at 0% 100%, rgba(220,38,38,.10), transparent 60%), linear-gradient(180deg, #0b0e12 0%, #0f172a 100%)",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-20 [background-image:radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:14px_14px]"
        aria-hidden
      />

      {/* Palestine flag  */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
        <div className="mx-auto max-w-screen-2xl">
          <div className="relative h-4 sm:h-5 md:h-6 lg:h-7 overflow-hidden rounded-b-xl shadow-[0_6px_16px_rgba(0,0,0,.35)]">
            {/* stripes */}
            <div className="absolute inset-0 grid grid-cols-3">
              <div className="bg-black/85" />
              <div className="bg-white/90" />
              <div className="bg-green-600/85" />
            </div>
            {/* red triangle */}
            <div className="absolute left-0 top-0 h-full w-14 sm:w-16 md:w-20 bg-red-600 [clip-path:polygon(0%_0%,100%_50%,0%_100%)] shadow-[0_0_18px_rgba(220,38,38,.55)]" />
            {/* thin separators for a crisp look */}
            <div className="absolute inset-0 grid grid-cols-3">
              <div className="border-r border-white/25" />
              <div className="border-r border-black/20" />
              <div />
            </div>
            {/* glossy sheen */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/30 mix-blend-overlay" />
            {/* subtle bottom edge */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>

      {/* Soft top vignette under the ribbon */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-24 bg-gradient-to-b from-black/30 via-transparent to-transparent z-10" ria-hidden />

      {/* Content (add top padding so it clears the ribbon height) */}
      <div className="relative z-10 pt-2 sm:pt-8 md:pt-8">{children}</div>
    </div>
  );
}
