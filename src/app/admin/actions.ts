"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminMode, checkPassword, clearAdminCookie, requireAdmin, setAdminCookie } from "@/lib/auth";
import { refundRegistration, saveCamp, toggleInquiry, type Camp } from "@/lib/store";

export async function login(_: { error?: string }, f: FormData) {
  if (!checkPassword(String(f.get("password") ?? ""))) return { error: "That password isn't right." };
  await setAdminCookie();
  redirect("/admin");
}

export async function logout() {
  await clearAdminCookie();
  // Ends the Cloudflare Access session too, so the next visit asks for a new email code.
  redirect(adminMode() === "access" ? "/cdn-cgi/access/logout" : "/admin/login");
}

export async function saveCampAction(f: FormData) {
  await requireAdmin();
  const dollars = Number(String(f.get("price") ?? "0").replace(/[^0-9.]/g, "")) || 0;
  const id = String(f.get("id") ?? "") || undefined;
  await saveCamp({
    id,
    name: String(f.get("name") ?? "").trim() || "Untitled camp",
    kind: String(f.get("kind") ?? "Summer camp") as Camp["kind"],
    season: String(f.get("season") ?? "Summer") as Camp["season"],
    where: String(f.get("where") ?? "").trim(),
    dates: String(f.get("dates") ?? "").trim(),
    time: String(f.get("time") ?? "").trim(),
    ages: String(f.get("ages") ?? "").trim() || "[AGES]",
    priceCents: Math.round(dollars * 100),
    capacity: Math.max(1, Number(f.get("capacity")) || 1),
    siblingDiscountPct: Math.min(100, Math.max(0, Number(f.get("sibling")) || 0)),
    blurb: String(f.get("blurb") ?? "").trim(),
    image: String(f.get("image") ?? "/images/summer-camps.jpg"),
    imagePos: "50% 40%",
    published: f.get("published") === "on",
  });
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function refundAction(f: FormData) {
  await requireAdmin();
  await refundRegistration(String(f.get("id")));
  revalidatePath("/admin/registrations");
}

export async function toggleInquiryAction(f: FormData) {
  await requireAdmin();
  await toggleInquiry(String(f.get("id")));
  revalidatePath("/admin/requests");
}
