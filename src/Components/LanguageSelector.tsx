import { RefreshCw } from "lucide-react";
import { Lang } from "../hooks/useAyah";

export default function LanguageSelector({
  lang,
  changeLang,
  refreshAyah,
  loading
}: {
  lang: Lang;
  changeLang: (l: Lang) => void;
  refreshAyah: (l?: Lang) => void;
  loading: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={lang}
        onChange={(e) => changeLang(e.target.value as Lang)}
        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-100"
      >
        <option value="ar">العربية</option>
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
      <button
        onClick={() => refreshAyah(lang)}
        disabled={loading}
        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-50"
      >
        <RefreshCw className="h-4 w-4" /> Refresh
      </button>
    </div>
  );
}
