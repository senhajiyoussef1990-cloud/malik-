// Rend la scène image par image avec Chromium, puis monte la vidéo avec ffmpeg.
// Usage : node render.js [edition] [--preview t1,t2,...]
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");

const ed = process.argv[2] || "2026-11-15-1";
const pi = process.argv.indexOf("--preview");
const preview = pi > 0 ? process.argv[pi + 1].split(",").map(Number) : null;
const dir = __dirname, out = path.join(dir, "out"), frames = path.join(out, "frames-" + ed);
fs.mkdirSync(frames, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const url = "file://" + path.join(dir, "scene.html") + "?ed=" + ed;
  const open = async () => {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    page.on("pageerror", (e) => console.error("pageerror:", e.message));
    await page.goto(url);
    await page.evaluate(() => window.ready);
    return page;
  };
  if (process.argv.includes("--brand")) {
    const browser2 = browser;
    const page = await browser2.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    await page.goto(url); await page.evaluate(() => window.ready);
    await page.evaluate(() => window.renderBrand("cover"));
    await page.screenshot({ path: path.join(out, "page-couverture.jpg"), type: "jpeg", quality: 94 });
    const pp = await browser2.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1.8621 });
    await pp.goto(url); await pp.evaluate(() => window.ready);
    await pp.evaluate(() => window.renderBrand("profile"));
    await pp.screenshot({ path: path.join(out, "page-profil.png"), clip: { x: 140, y: 580, width: 580, height: 580 } });
    await browser.close();
    console.log("brand ok");
    return;
  }
  if (process.argv.includes("--story")) {
    const page = await open();
    await page.evaluate(() => window.renderStory());
    await page.screenshot({ path: path.join(out, `story-${ed}.jpg`), type: "jpeg", quality: 92 });
    await browser.close();
    console.log("story ok");
    return;
  }
  if (preview) {
    const page = await open();
    for (const t of preview) {
      await page.evaluate((f) => window.renderFrame(f), Math.round(t * 24));
      await page.screenshot({ path: path.join(out, `preview-${t}.jpg`), type: "jpeg", quality: 85 });
    }
    await browser.close();
    return;
  }
  const page0 = await open();
  const total = Math.round(await page0.evaluate(() => window.DURATION * window.FPS));
  const N = 4, pages = [page0];
  for (let i = 1; i < N; i++) pages.push(await open());
  let done = 0;
  await Promise.all(pages.map(async (page, w) => {
    for (let f = w; f < total; f += N) {
      await page.evaluate((f) => window.renderFrame(f), f);
      await page.screenshot({ path: path.join(frames, String(f).padStart(5, "0") + ".jpg"), type: "jpeg", quality: 92 });
      if (++done % 100 === 0) console.log(`${done}/${total}`);
    }
  }));
  await browser.close();
  console.log("frames ok", total);
})();
