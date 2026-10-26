// The photographs' web copies, written before `next dev` and `next build`
// (npm's `predev` and `prebuild`): a WebP of every original in `media/team`
// at each width in `src/lib/photo-widths.json`, into `public/team`, which is
// generated and not kept in git. `src/lib/image-loader.ts` points `next/image`
// at them. A copy newer than its original is left alone, so only a new or
// changed photo costs anything — unless the widths or the quality changed,
// which `.settings.json` records: then the folder is written again from
// scratch, so no copy at an old setting is left behind.
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE = "media/team";
const TARGET = "public/team";
// Behind the tiles' gradient and desaturation, 62 is indistinguishable from
// higher settings and about a third lighter.
const QUALITY = 62;

const widths = JSON.parse(await readFile("src/lib/photo-widths.json", "utf8"));
const WIDTHS = [...widths.imageSizes, ...widths.deviceSizes];

const settings = JSON.stringify({ widths: WIDTHS, quality: QUALITY });
const stamp = path.join(TARGET, ".settings.json");
if ((await readFile(stamp, "utf8").catch(() => "")) !== settings) {
  await rm(TARGET, { recursive: true, force: true });
}
await mkdir(TARGET, { recursive: true });

let written = 0;
for (const file of await readdir(SOURCE)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;
  const source = path.join(SOURCE, file);
  const { mtimeMs } = await stat(source);
  const name = path.parse(file).name;

  for (const width of WIDTHS) {
    const target = path.join(TARGET, `${name}-${width}.webp`);
    const current = await stat(target).catch(() => null);
    if (current && current.mtimeMs >= mtimeMs) continue;

    // Never enlarged: an original narrower than a width is written at its
    // own size under that width's name, so every name the loader asks for exists.
    await sharp(source)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
      .toFile(target);
    written++;
  }
}

await writeFile(stamp, settings);
console.log(`photos: ${written} web copies written to ${TARGET}`);
