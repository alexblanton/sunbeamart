import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessJwt } from "./access";

// How /admin sign-in works, picked from the Worker's settings (first match wins):
//   "access"   - ACCESS_TEAM_DOMAIN and ACCESS_AUD are set: Cloudflare Access signs people in
//                (email one-time code) and every admin request must carry a valid Access token.
//   "password" - ADMIN_PASSWORD secret is set: the site's own password form.
//   "demo"     - local development, or DEMO_ADMIN=1 (branch previews): password "sunbeam-demo".
//   "off"      - none of the above (e.g. production before setup): admin is locked.
export type AdminMode = "access" | "password" | "demo" | "off";

const COOKIE = "sb_admin";
const DEMO_PASSWORD = "sunbeam-demo";
const env = (k: string) => (process.env[k] ?? "").trim();

export function adminMode(): AdminMode {
  if (env("ACCESS_TEAM_DOMAIN") && env("ACCESS_AUD")) return "access";
  if (env("ADMIN_PASSWORD")) return "password";
  if (process.env.NODE_ENV !== "production" || env("DEMO_ADMIN") === "1") return "demo";
  return "off";
}

function password() {
  const mode = adminMode();
  return mode === "password" ? env("ADMIN_PASSWORD") : mode === "demo" ? DEMO_PASSWORD : "";
}
const token = () => createHmac("sha256", `sunbeam-admin:${password()}`).update("session-v2").digest("hex");

function same(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPassword(p: string) {
  const mode = adminMode();
  return (mode === "password" || mode === "demo") && !!p && same(p, password());
}

export async function setAdminCookie() {
  (await cookies()).set(COOKIE, token(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
}
export async function clearAdminCookie() {
  (await cookies()).delete(COOKIE);
}

/** The signed-in admin, or null. `email` is set when Cloudflare Access signed them in. */
export async function currentAdmin(): Promise<{ email?: string } | null> {
  const mode = adminMode();
  if (mode === "access") {
    const h = await headers();
    const email = await verifyAccessJwt(h.get("cf-access-jwt-assertion"), { teamDomain: env("ACCESS_TEAM_DOMAIN"), aud: env("ACCESS_AUD") });
    if (!email) return null;
    const allowed = env("ADMIN_EMAILS").toLowerCase().split(/[\s,]+/).filter(Boolean);
    if (allowed.length && !allowed.includes(email.toLowerCase())) return null;
    return { email };
  }
  if (mode === "off") return null;
  const c = (await cookies()).get(COOKIE)?.value;
  return c && same(c, token()) ? {} : null;
}

export async function isAdmin() {
  return (await currentAdmin()) !== null;
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect(adminMode() === "access" ? "/admin/denied" : "/admin/login");
}
