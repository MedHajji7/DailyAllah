import { Ayah } from "../hooks/useAyah";

export default function FavoritesList({
  favs,
  setAyah
}: {
  favs: Ayah[];
  setAyah: (a: Ayah) => void;
}) {
  if (favs.length === 0) return null;
  return (
    <div className="mt-6">
      <div className="mb-2 text-sm text-slate-300">Favorites</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {favs.slice(0, 6).map((f) => (
          <button
            key={f.key}
            onClick={() => setAyah(f)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left hover:bg-white/10"
          >
            <div className="text-xs text-slate-400">{f.surahName} • {f.key}</div>
            <div dir="rtl" className="font-arabic text-base line-clamp-1">{f.arabic}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
