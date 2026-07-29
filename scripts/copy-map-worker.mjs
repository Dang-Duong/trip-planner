// maplibre-gl v6 derives its worker URL from import.meta.url and gives up (empty
// string) when that isn't an http(s) URL — which is what bundled chunks hand it.
// Without a worker the GeoJSON pipeline never parses and the route line never draws.
// So we serve the worker ourselves from /public and point setWorkerUrl at it.
//
// Both files are needed and the names are load-bearing: maplibre-gl-worker.mjs does
// `import ... from "./maplibre-gl-shared.mjs"`, so the shared chunk must sit next to
// it under exactly that name.
//
// Copied at pre{dev,build} rather than committed, so it can't drift from the
// installed maplibre-gl version.
import { copyFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const dist = join(dirname(require.resolve("maplibre-gl/package.json")), "dist");
const publicDir = join(process.cwd(), "public");

await mkdir(publicDir, { recursive: true });

for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  await copyFile(join(dist, file), join(publicDir, file));
  console.log(`maplibre → ./public/${file}`);
}
