import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { Ayah } from "../hooks/useAyah";

export default function AudioPlayer({ ayah }: { ayah: Ayah }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [src, setSrc] = useState<string>("");

  // Fetch audio URL when ayah changes
  useEffect(() => {
    if (!ayah.key) return;
    const fetchAudio = async () => {
      try {
        const res = await fetch(
          `https://api.alquran.cloud/v1/ayah/${ayah.key}/ar.alafasy`
        );
        const json = await res.json();
        const url = json?.data?.audio || "";
        setSrc(url);
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      } catch {
        setSrc("");
      }
    };
    fetchAudio();
  }, [ayah.key]);

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }

  return (
    <div className="mt-4 flex items-center gap-2">
      <button
        onClick={togglePlay}
        disabled={!src}
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs hover:bg-white/10 disabled:opacity-50"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {isPlaying ? "Pause" : "Play"} Audio
      </button>
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
