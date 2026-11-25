/* Free & open-source media optimizer (sharp + ffmpeg) */
const sharp = require("sharp");
const ffmpeg = require("ffmpeg-static");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const IMG_DIR = path.join(ROOT, "images");
const VID_DIR = path.join(ROOT, "videos");
const OUT_IMG = path.join(ROOT, "images_optimized");
const OUT_VID = path.join(ROOT, "videos_optimized");

for (const d of [OUT_IMG, OUT_VID]) fs.mkdirSync(d, { recursive: true });

const kb = n => (n / 1024).toFixed(0).padStart(6) + " KB";
let savedImgs = 0, savedVids = 0;

/* ---------- IMAGES ---------- */
async function optimizeImages() {
  const files = [];
  (function walk(dir) {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name);
      if (f.isDirectory()) walk(p);
      else files.push(p);
    }
  })(IMG_DIR);

  for (const src of files) {
    const rel = path.relative(IMG_DIR, src);
    const base = rel.replace(/\.(jpe?g|png|webp|gif|tiff?|avif)$/i, "");
    const dst = path.join(OUT_IMG, base + ".webp");
    fs.mkdirSync(path.dirname(dst), { recursive: true });

    const meta = await sharp(src).metadata();
    let img = sharp(src).rotate(); // respect EXIF
    // Never upscale; cap width at 1600px (plenty for full-width sections)
    if ((meta.width || 0) > 1600) img = img.resize({ width: 1600, withoutEnlargement: true });

    img = img.webp({ quality: 78, effort: 5 });
    // Icons/logos get transparent-friendly settings automatically (webp keeps alpha)
    const buf = await img.toBuffer();
    fs.writeFileSync(dst, buf);
    const before = fs.statSync(src).size, after = buf.length;
    savedImgs += before - after;
    console.log(`${kb(before)} -> ${kb(after)}  ${rel}`);
  }
}

/* ---------- VIDEOS ---------- */
function optimizeVideos() {
  // Hero: 360p & 720p H.264, no audio (background loops silently), faststart for instant play
  const jobs = [
    { in: " hero.mp4", w: 854, crf: 30 }, // placeholder to keep parser happy (removed below)
  ];
  jobs.length = 0; // real jobs:

  const videoJobs = [
    // 480p kept as fallback; hero now serves 720p minimum, 1080p on large screens
    { in: path.join(VID_DIR, "hero.mp4"), out: path.join(OUT_VID, "hero-480.mp4"), w: 854, crf: 31 },
    { in: path.join(VID_DIR, "hero.mp4"), out: path.join(OUT_VID, "hero-720.mp4"), w: 1280, crf: 28 },
    { in: path.join(VID_DIR, "hero.mp4"), out: path.join(OUT_VID, "hero-1080.mp4"), w: 1920, crf: 27 },
  ];
  for (const j of videoJobs) {
    if (!fs.existsSync(j.in)) { console.log("SKIP (missing):", j.in); continue; }
    const args = [
      "-y", "-i", j.in,
      "-vf", `scale=${j.w}:-2:flags=bicubic`,
      "-c:v", "libx264", "-crf", String(j.crf), "-preset", "veryfast",
      "-pix_fmt", "yuv420p", "-profile:v", "baseline", "-level", "3.1",
      "-movflags", "+faststart", "-an",
      j.out,
    ];
    console.log("Encoding:", path.basename(j.out), "...");
    execFileSync(ffmpeg, args, { stdio: ["ignore", "ignore", "pipe"] });
    const before = fs.statSync(j.in).size, after = fs.statSync(j.out).size;
    savedVids += before - after;
    console.log(`${kb(before)} -> ${kb(after)}  ${path.basename(j.out)}`);
  }
}

(async () => {
  console.log("=== IMAGES ===");
  await optimizeImages();
  console.log("\n=== VIDEOS ===");
  try { optimizeVideos(); } catch (e) { console.error("video step:", e.message); }
  console.log(`\nDone. Images saved: ${(savedImgs / 1048576).toFixed(1)} MB, Videos saved: ${(savedVids / 1048576).toFixed(1)} MB`);
})();
