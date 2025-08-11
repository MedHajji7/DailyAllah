export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm p-4 sm:p-5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_10px_20px_-10px_rgba(0,0,0,0.6)] hover:bg-white/7.5 transition-colors">
      {children}
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 sm:space-y-4">
      <h2 className="text-base sm:text-lg font-semibold text-slate-200">{title}</h2>
      {children}
    </section>
  );
}

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0f1115]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0f1115]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="font-semibold tracking-wide">Daily Allah</div>
        <div className="hidden sm:flex items-center gap-3 text-sm text-slate-300">
          <button className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5">Sign in</button>
          <button className="rounded-lg bg-white text-black px-3 py-1.5 hover:bg-slate-100">Get App</button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-10 sm:mt-12 border-t border-white/5 text-xs sm:text-sm text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        © {new Date().getFullYear()} Mohamed Hajji
      </div>
    </footer>
  );
}
