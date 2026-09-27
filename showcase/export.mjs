// Exporta o showcase como MP4 1920x1080.
// Uso: npm run showcase:export -- [caminho/do/video.mp4] [saida.mp4] [--offset=1.5]
// Requer: Chrome instalado (usa o canal "chrome" do Playwright) e ffmpeg no PATH.
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const offset = (args.find((a) => a.startsWith("--offset=")) || "--offset=0").split("=")[1];
const positional = args.filter((a) => !a.startsWith("--"));
const videoPath = path.resolve(positional[0] || path.join(here, "academia_iai_video_final_2min_v2.mp4"));
const outPath = path.resolve(positional[1] || path.join(here, "showcase.mp4"));
const W = 1920, H = 1080;

if (!fs.existsSync(videoPath)) {
  console.error(`Vídeo não encontrado: ${videoPath}`);
  process.exit(1);
}

const tmpDir = fs.mkdtempSync(path.join(here, ".export-"));
// Usa o Chrome instalado (decodifica H.264). CHROME_PATH sobrescreve o caminho.
const browser = await chromium.launch({
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" }),
  args: ["--autoplay-policy=no-user-gesture-required", "--allow-file-access-from-files"],
});
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
  recordVideo: { dir: tmpDir, size: { width: W, height: H } },
});
const page = await ctx.newPage();
const t0 = Date.now();
const url = `file://${path.join(here, "showcase.html")}?src=${encodeURIComponent(`file://${videoPath}`)}&hide=1&autoplay=1&offset=${offset}`;
await page.goto(url);
await page.waitForFunction(() => document.querySelector("video").duration > 0);
await page.waitForFunction(() => !document.querySelector("video").paused, null, { timeout: 60000 });
const lead = (Date.now() - t0) / 1000;
const duration = await page.evaluate(() => document.querySelector("video").duration);
console.log(`Gravando ${duration.toFixed(1)}s…`);
await page.waitForFunction(() => document.body.dataset.ended === "1", null, { timeout: (duration + 60) * 1000 });
const played = (Date.now() - t0) / 1000 - lead;
if (played > duration * 1.03) console.warn(`Aviso: playback levou ${played.toFixed(1)}s para ${duration.toFixed(1)}s de vídeo (máquina lenta); o MP4 sai com essa duração.`);
await page.waitForTimeout(1500);
const wall = (Date.now() - t0) / 1000;
const webm = await page.video().path();
await ctx.close();
await browser.close();

// O gravador do playwright pode esticar a linha do tempo quando a máquina não acompanha 1080p;
// normaliza pela razão duração-do-webm / tempo-de-parede para o MP4 sair em tempo real.
const probe = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", webm], { encoding: "utf8" });
const webmDur = parseFloat(probe.stdout) || wall;
const k = webmDur / wall;
if (Math.abs(k - 1) > 0.02) console.log(`Ajustando velocidade da gravação: ×${(1 / k).toFixed(3)}`);

console.log("Convertendo para MP4…");
const ff = spawnSync(
  "ffmpeg",
  ["-y", "-ss", (lead * k).toFixed(2), "-i", webm, "-vf", `setpts=PTS/${k.toFixed(5)}`, "-t", (played + 0.5).toFixed(2), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "slow", "-crf", "18", "-r", "30", "-movflags", "+faststart", outPath],
  { stdio: "inherit" },
);
fs.rmSync(tmpDir, { recursive: true, force: true });
if (ff.status !== 0) process.exit(ff.status ?? 1);
console.log(`OK → ${outPath}`);
