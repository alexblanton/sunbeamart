// Runs after `npm install` / `npm ci`. Only does anything inside Cloudflare Workers Builds
// (which sets WORKERS_CI=1): it builds the OpenNext bundle so the dashboard's plain
// `npx wrangler deploy` / `npx wrangler preview` has something to upload.
// Wrangler hands `deploy` off to `opennextjs-cloudflare deploy` before it would run a
// wrangler.jsonc build command, so the build has to happen here instead.
import { spawnSync } from "node:child_process";

if (process.env.WORKERS_CI !== "1") process.exit(0);

console.log("Workers Builds detected: building the site with OpenNext before deploy");
const r = spawnSync("npx", ["opennextjs-cloudflare", "build"], { stdio: "inherit", shell: process.platform === "win32" });
process.exit(r.status ?? 1);
