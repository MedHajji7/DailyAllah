import { Copy, Heart, Download } from "lucide-react";
import { Ayah } from "../hooks/useAyah";

// I export via Canvas => no CORS, no hidden DOM, just works.
const SIZE = 1080;

// I draw a rounded card path once, then fill/stroke it.
function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

// Simple word-wrap I wrote: respects \n and breaks on max width.
function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) {
  const paras = text.split(/\n+/);
  const lines: string[] = [];
  for (const para of paras) {
    const words = para.split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push("");
      continue;
    }
    let line = words[0];
    for (let i = 1; i < words.length; i++) {
      const test = line + " " + words[i];
      if (ctx.measureText(test).width <= maxWidth) line = test;
      else {
        lines.push(line);
        line = words[i];
      }
    }
    lines.push(line);
  }
  return lines;
}

// I render the whole ayah into a 1080x1080 PNG and return dataURL.
function renderAyahPNG(ayah: Ayah): string {
  // meta I need for header/footer
  const [sNoStr, aNoStr] = ayah.key.split(":");
  const surahNo = Number(sNoStr || 0);
  const ayahNo = Number(aNoStr || 0);
  const hizb =
    (ayah as any).hizb ??
    (ayah as any).hizbNumber ??
    (ayah as any).hizb_index ??
    null;
  const topMeta = `${ayah.surahName} • ${surahNo}:${ayahNo}${
    hizb ? ` • Hizb ${hizb}` : ""
  }`;

  // canvas boot
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.textBaseline = "alphabetic";

  // solid bg (export-safe)
  ctx.fillStyle = "#0b1220";
  ctx.fillRect(0, 0, SIZE, SIZE);

  // card panel
  const pad = 64;
  const cardX = pad,
    cardY = pad,
    cardW = SIZE - pad * 2,
    cardH = SIZE - pad * 2;
  ctx.fillStyle = "rgba(255,255,255,0.045)";
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 32);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.stroke();

  // header
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff";
  const headerY = cardY + 40;
  const minTop = headerY + 32;
  ctx.font =
    "600 28px ui-sans-serif, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
  ctx.fillText(topMeta, SIZE / 2, headerY);

  // arabic (RTL, big)
  ctx.direction = "rtl";
  ctx.font = "700 60px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
  const maxTextWidth = cardW - 120;
  const arabicLines = wrapLines(ctx, ayah.arabic, maxTextWidth);
  
  // center the Arabic block inside the card
  const arabicLH = 60 * 1.8;
  const arabicBlockH = arabicLines.length * arabicLH;
  //here i can change the space between header and Ayah
  const centerBias = -80;
  const centerY = cardY + cardH / 2 + centerBias;
  const firstArabicY = Math.max(minTop, centerY - arabicBlockH / 2);

  arabicLines.forEach((line, i) => {
    ctx.fillText(line, SIZE / 2, firstArabicY + i * arabicLH);
  });

  // divider
  const lastArabicY = firstArabicY + (arabicLines.length - 1) * arabicLH;
  ctx.direction = "ltr";
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 1;
  const divY = lastArabicY + 28;
  ctx.beginPath();
  ctx.moveTo(SIZE / 2 - 200, divY);
  ctx.lineTo(SIZE / 2 + 200, divY);
  ctx.stroke();

  // translation (LTR, readable)
  ctx.font =
    "400 34px ui-sans-serif, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
  const transLH = 34 * 1.7;
  const transStartY = divY + 66; // spacing under divider
  const transLines = wrapLines(ctx, ayah.translation, maxTextWidth);
  transLines.forEach((line, i) => {
    ctx.fillText(line, SIZE / 2, transStartY + i * transLH);
  });

  // footer
  ctx.font =
    "400 22px ui-sans-serif, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
  ctx.globalAlpha = 0.8;
  ctx.fillText('DailyAllah', SIZE / 2, cardY + cardH - 36);
  ctx.globalAlpha = 1;

  // done
  return canvas.toDataURL("image/png");
}

export default function AyahActions({
  ayah,
  toggleFav,
  isFav,
}: {
  ayah: Ayah;
  toggleFav: (a: Ayah) => void;
  isFav: boolean;
}) {
  // copy plain text (what I’d paste anywhere)
  async function copyAyah() {
    const [sNoStr, aNoStr] = ayah.key.split(":");
    const hizb =
      (ayah as any).hizb ??
      (ayah as any).hizbNumber ??
      (ayah as any).hizb_index ??
      null;
    const meta = `${ayah.surahName} • ${sNoStr}:${aNoStr}${
      hizb ? ` • Hizb ${hizb}` : ""
    }`;
    await navigator.clipboard.writeText(
      `${ayah.arabic}\n\n${ayah.translation}\n— ${meta}`
    );
  }

  // export via canvas and download (1 click, no BS)
  function downloadPNG() {
    const dataUrl = renderAyahPNG(ayah);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `ayah-${ayah.key.replace(":", "-")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <button onClick={copyAyah} className="btn-action">
        <Copy className="h-4 w-4" /> Copy
      </button>

      <button
        onClick={() => toggleFav(ayah)}
        className={`btn-action ${
          isFav ? "border-rose-400/30 bg-rose-400/10" : ""
        }`}
        aria-pressed={isFav}
      >
        <Heart
          className={`h-4 w-4 ${isFav ? "fill-current text-rose-300" : ""}`}
        />
        Favorite
      </button>

      {/* share is useless here, user downloads then shares anywhere */}
      <button onClick={downloadPNG} className="btn-action">
        <Download className="h-4 w-4" /> Download
      </button>
    </div>
  );
}
