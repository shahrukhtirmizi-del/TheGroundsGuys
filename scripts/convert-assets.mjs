import sharp from "sharp";
const D = "C:/Users/shahr/Downloads/";
const map = {
  "ChatGPT Image Sep 15, 2026, 03_12_29 AM.png": "service-mowing.jpg",
  "ChatGPT Image Sep 15, 2026, 03_13_35 AM.png": "service-landscape-install.jpg",
  "ChatGPT Image Sep 15, 2026, 03_14_21 AM.png": "service-irrigation.jpg",
  "ChatGPT Image Sep 15, 2026, 03_15_31 AM.png": "team-crew.jpg",
  "ChatGPT Image Sep 15, 2026, 03_16_26 AM.png": "before-lawn.jpg",
  "ChatGPT Image Sep 15, 2026, 03_17_18 AM.png": "after-lawn.jpg",
  "ChatGPT Image Sep 15, 2026, 03_18_01 AM.png": "cta-wide-shot.jpg",
};
for (const [src, out] of Object.entries(map)) {
  const meta = await sharp(D + src).metadata();
  const info = await sharp(D + src).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile("public/" + out);
  console.log(out, meta.width + "x" + meta.height, "->", info.width + "x" + info.height, Math.round(info.size / 1024) + "KB");
}
