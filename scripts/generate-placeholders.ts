import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { content, PROFILE_IMAGE, type MediaItem } from "../src/lib/content";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function svgPlaceholder(label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" role="img" aria-label="${escapeXml(label)}">
  <rect width="400" height="500" fill="#d4d4d4" />
  <text x="200" y="250" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="20" fill="#737373">${escapeXml(label)}</text>
</svg>
`;
}

function writePlaceholder(publicRelativePath: string, label: string) {
  const fullPath = join(PUBLIC_DIR, publicRelativePath.replace(/^\//, ""));
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, svgPlaceholder(label), "utf-8");
}

function collectSvgEntries(): Array<{ path: string; label: string }> {
  const entries: Array<{ path: string; label: string }> = [];

  if (PROFILE_IMAGE.endsWith(".svg")) {
    entries.push({ path: PROFILE_IMAGE, label: "Profilfoto" });
  }

  for (const cat of content.portfolio.categories) {
    if (cat.cover.endsWith(".svg")) entries.push({ path: cat.cover, label: cat.title.de });
    for (const item of cat.media) {
      if (item.url.endsWith(".svg")) entries.push({ path: item.url, label: item.alt });
    }
    for (const client of cat.clients ?? []) {
      if (client.cover.endsWith(".svg")) entries.push({ path: client.cover, label: client.name });
      for (const item of client.media) {
        if (item.url.endsWith(".svg")) entries.push({ path: item.url, label: item.alt });
      }
    }
  }

  return entries;
}

function collectMissingVideoPaths(): string[] {
  const paths: string[] = [];

  for (const cat of content.portfolio.categories) {
    if (cat.cover.endsWith(".mp4")) paths.push(cat.cover);
    for (const item of cat.media as MediaItem[]) {
      if (item.type === "video") paths.push(item.url);
    }
    for (const client of cat.clients ?? []) {
      for (const item of client.media as MediaItem[]) {
        if (item.type === "video") paths.push(item.url);
      }
    }
  }

  return paths;
}

const svgEntries = collectSvgEntries();
for (const entry of svgEntries) {
  writePlaceholder(entry.path, entry.label);
}
console.log(`${svgEntries.length} Platzhalter-SVGs erzeugt in public/images/.`);

const missingVideos = collectMissingVideoPaths();
if (missingVideos.length > 0) {
  console.log("\nNoch fehlende Video-Dateien (liefert Marco nach):");
  for (const path of missingVideos) {
    console.log(`  ${path}`);
  }
}
