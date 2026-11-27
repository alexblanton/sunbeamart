import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "sb_admin";

function password() {
  // The demo falls back to a well-known password. Set ADMIN_PASSWORD before any real use.
  return process.env.ADMIN_PASSWORD || "sunbeam-demo";
}
const token = () => createHash("sha256").update(`sunbeam:${password()}`).digest("hex");

export const checkPassword = (p: string) => p === password();

export async function setAdminCookie() {
  (await cookies()).set(COOKIE, token(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
}
export async function clearAdminCookie() {
  (await cookies()).delete(COOKIE);
}
export async function isAdmin() {
  return (await cookies()).get(COOKIE)?.value === token();
}
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
