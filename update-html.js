/* Updates index.html to use optimized media:
   - .png/.jpg      -> .webp        (optimizer output: name.webp)
   - .svg           -> .svg.webp    (optimizer output: name.svg.webp)
   - adds width/height from sharp (CLS fix)
   - adds loading="lazy" decoding="async" (navbar logo stays eager)
   - swaps hero video sources to hero-480.mp4 + poster
   - defers js/app.js, adds meta description
   Always restores ./_backup_html/index.html.pre-optimize first (idempotent).
*/
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = __dirname;
const IMG = path.join(ROOT, "images");
const HTML = path.join(ROOT, "index.html");
const BAK = path.join(ROOT, "_backup_html", "index.html.pre-optimize");

if (!fs.existsSync(BAK)) { console.error("No backup found!" ); process.exit(1); }
fs.copyFileSync(BAK, HTML);
let html = fs.readFileSync(HTML, "utf8");

/* 1a. Raster: drop original extension, use .webp (apostrophes allowed) */
html = html.replace(/images\/([^"?\r\n]+?)\.(png|jpe?g)\b/gi, "images/$1.webp");
/* 1b. SVG: keep name, add .webp */
html = html.replace(/images\/([^"?\r\n]+?)\.svg\b/gi, "images/$1.svg.webp");
/* favicon */
html = html.replace('<link rel="icon" type="image/png" href="images/logo.webp">',
  '<link rel="icon" type="image/webp" href="images/logo.webp">');

/* 2+3. Dimensions + lazy loading */
const imgTagRe = /<img\s+src="(images\/[^"]+)"([^>]*)>/g;

(async () => {
  const tags = [...html.matchAll(imgTagRe)];
  let lazyCount = 0, missing = 0;
  for (const full of tags) {
    const rel = full[1];            // e.g. images/foo.webp
    const rest = full[2] || "";
    const file = path.join(IMG, rel.replace(/^images\//, ""));
    if (!fs.existsSync(file)) { console.error("MISSING:", rel); missing++; continue; }
    const md = await sharp(file).metadata();
    let extra = rest;
    if (md.width && md.height && !/width=/.test(extra)) {
      extra += ` width="${md.width}" height="${md.height}"`;
    }
    const isLogo = rel === "images/logo.webp";
    if (!isLogo && !/loading=/.test(extra)) { extra += ' loading="lazy"'; lazyCount++; }
    if (!/decoding=|fetchpriority=/.test(extra)) extra += isLogo ? ' fetchpriority="high"' : ' decoding="async"';
    html = html.replace(full[0], `<img src="${rel}"${extra}>`);
  }
  console.log(`imgs: ${tags.length}, lazy: ${lazyCount}, missing: ${missing}`);

  /* 4. Hero video: small H.264 + poster */
  html = html.replace(
    /<video autoplay muted loop playsinline preload="metadata">[\s\S]*?<\/video>/,
    `<video autoplay muted loop playsinline preload="metadata" poster="images/growth.webp">
            <source src="videos/hero-480.mp4" type="video/mp4">
        </video>`
  );

  /* 5. Defer the script */
  html = html.replace('<script src="js/app.js"></script>', '<script defer src="js/app.js"></script>');

  /* 6. Meta description */
  html = html.replace(
    '<meta name="viewport"',
    '<meta name="description" content="Yajurvedh — an IIT IIM alumni venture. Next-gen, built-to-last, values-driven HR enterprise connecting great ambition with noble companies.">\n    <meta name="viewport"'
  );

  fs.writeFileSync(HTML, html);
  console.log("index.html updated from backup.");

  /* Final check: every referenced image must exist */
  const refs = [...html.matchAll(/(?:src|href)="(images\/[^"]+)"/g)].map(m => m[1]);
  const bad = refs.filter(r => !fs.existsSync(path.join(IMG, r.replace(/^images\//, ""))));
  console.log(bad.length ? "BROKEN REFS:\n" + bad.join("\n") : "All image refs OK ✔");
})();
