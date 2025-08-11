import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm p-4 sm:p-5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_10px_20px_-10px_rgba(0,0,0,0.6)] hover:bg-white/7.5 transition-colors">
      {children}
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 sm:space-y-4">
      <h2 className="text-base sm:text-lg font-semibold text-slate-200">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function TopNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  const base =
    "rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5 transition-colors";
  const active = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${base} bg-white/10 text-white` : base;

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0f1115]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0f1115]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand -> Home */}
        <Link to="/" className="flex items-center g">
          <img src="/DALogo.svg" alt="DailyAllah logo" className="h-12 w-12" />
          <span className="font-semibold tracking-wide">DailyAllah</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex w-full justify-center items-center gap-6">
          <NavLink to="/" end className={active}>
            Home
          </NavLink>
          <NavLink to="/quran" className={active}>
            Qur’an
          </NavLink>
        </nav>

        {/* Desktop actions */}
        {/* <div className="hidden sm:flex items-center gap-3 text-sm text-slate-300">
          <button className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5">
            Sign in
          </button>
          <button className="rounded-lg bg-white text-black px-3 py-1.5 hover:bg-slate-100">
            Get App
          </button>
        </div> */}

        {/* Mobile burger */}
        <button
          aria-label="Menu"
          className="sm:hidden rounded-md p-2 hover:bg-white/5"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="sm:hidden border-t border-white/5 bg-[#0f1115]/95">
          <nav className="px-4 py-3 flex flex-col gap-1">
            <NavLink to="/" end className={active}>
              Home
            </NavLink>
            <NavLink to="/quran" className={active}>
              Qur’an
            </NavLink>

            {/* <div className="pt-2 flex items-center gap-2">
              <button className="flex-1 rounded-lg border border-white/10 px-3 py-2 hover:bg-white/5">
                Sign in
              </button>
              <button className="flex-1 rounded-lg bg-white text-black px-3 py-2 hover:bg-slate-100">
                Get App
              </button>
            </div> */}
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-10 sm:mt-12 border-t border-white/5 text-xs sm:text-sm text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex justify-center">
        © {new Date().getFullYear()} By Mohamed Hajji
      </div>
    </footer>
  );
}
