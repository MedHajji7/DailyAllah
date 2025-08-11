// src/hooks/useExporter.ts
import * as htmlToImage from "html-to-image";

const CORE_CDN = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.js";

let ffmpegLoaded = false;
let FF: { instance: any; fetchFile: (x: any) => Promise<Uint8Array> } | null = null;

async function ensureFFmpeg() {
  if (ffmpegLoaded && FF) return FF;

  const mod: any = await import("@ffmpeg/ffmpeg");
  const createFFmpeg = mod.createFFmpeg ?? mod.default?.createFFmpeg;
  const fetchFile = mod.fetchFile ?? mod.default?.fetchFile;
  if (!createFFmpeg || !fetchFile) throw new Error("FFmpeg module shape not recognized");

  const instance = createFFmpeg({ log: false, corePath: CORE_CDN });
  await instance.load();

  FF = { instance, fetchFile };
  ffmpegLoaded = true;
  return FF;
}


// ---------- PNG export (unchanged) ----------
export async function exportStoryPNG(el: HTMLElement) {
  const dataUrl = await htmlToImage.toPng(el, {
    pixelRatio: 1, // I render at 1080x1920 already
    cacheBust: true,
    width: 1080,
    height: 1920,
    style: { transform: "none" },
  });

  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = "daily-ayah-story.png";
  a.click();
}

// ---------- MP4 export (static frame + audio) ----------
export async function exportStoryMP4(
  pngEl: HTMLElement,
  audioUrl: string,
  seconds = 30
) {
  if (!audioUrl) throw new Error("No audio URL");

  // Snapshot the 1080x1920 frame
  const pngDataUrl = await htmlToImage.toPng(pngEl, {
    pixelRatio: 1,
    cacheBust: true,
    width: 1080,
    height: 1920,
  });

  const pngBlob = await (await fetch(pngDataUrl)).blob();
  const audioBlob = await (await fetch(audioUrl)).blob();

  const { instance, fetchFile } = await ensureFFmpeg();

  instance.FS("writeFile", "frame.png", await fetchFile(pngBlob));
  instance.FS("writeFile", "audio.mp3", await fetchFile(audioBlob));

  await instance.run(
    "-loop",
    "1",
    "-t",
    String(seconds),
    "-i",
    "frame.png",
    "-i",
    "audio.mp3",
    "-vf",
    "scale=1080:1920:flags=lanczos",
    "-c:v",
    "libx264",
    "-tune",
    "stillimage",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-pix_fmt",
    "yuv420p",
    "-shortest",
    "out.mp4"
  );

  const out = instance.FS("readFile", "out.mp4");
  const url = URL.createObjectURL(new Blob([out.buffer], { type: "video/mp4" }));

  const a = document.createElement("a");
  a.href = url;
  a.download = "daily-ayah-story.mp4";
  a.click();
  URL.revokeObjectURL(url);
}
