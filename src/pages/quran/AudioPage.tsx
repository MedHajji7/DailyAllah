// src/pages/quran/AudioPage.tsx
import { useEffect, useRef, useState } from "react";
import { listReciters, getChapterMp3 } from "../../api/quran";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setReciter, setSurah } from "../../store/audioSlice";
import { useNavigate } from "react-router-dom";

export default function AudioPage() {
  const d = useAppDispatch();
  const navigate = useNavigate();
  const { reciterId, surah } = useAppSelector((s) => s.audio);

  const [reciters, setReciters] = useState<{ id: number; name: string }[]>([]);
  const [mp3Url, setMp3Url] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => { listReciters().then(setReciters); }, []);

  // fetch full-surah MP3 whenever reciter/surah changes
  useEffect(() => {
    if (!reciterId) { setMp3Url(""); setError(""); return; }
    setLoading(true); setError(""); setMp3Url("");
    getChapterMp3(reciterId, surah)
      .then((url) => {
        if (!url) {
          setError("This reciter has no single-file MP3 for this sūrah. Try another reciter.");
          return;
        }
        setMp3Url(url);
        // auto-load into player
        if (audioRef.current) {
          audioRef.current.src = url;
          // do not auto-play; let the user hit play
        }
      })
      .catch(() => setError("Failed to load audio."))
      .finally(() => setLoading(false));
  }, [reciterId, surah]);

  const goDownload = () => {
    if (!reciterId) return;
    navigate(`/quran/downloads?reciter=${reciterId}&surah=${surah}`);
  };

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={reciterId ?? ""}
          onChange={(e) => d(setReciter(Number(e.target.value)))}
          style={{ colorScheme: "dark" }}
          className="bg-white/5 border border-white/10 rounded px-3 py-2"
        >
          <option value="">Choose reciter</option>
          {reciters.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          max={114}
          value={surah}
          onChange={(e) => d(setSurah(+e.target.value))}
          className="bg-white/5 border border-white/10 rounded px-3 py-2 w-24"
        />

        {/* <button
          onClick={goDownload}
          disabled={!reciterId}
          className="rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/5 disabled:opacity-40"
        >
          Download MP3
        </button> */}
      </div>

      {loading && <p className="text-slate-400">Loading audio…</p>}
      {error && <p className="text-amber-300 text-sm">{error}</p>}

      <audio ref={audioRef} controls className="w-full" src={mp3Url || undefined} />
    </div>
  );
}
