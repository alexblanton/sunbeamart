"use server";

import { addInquiry, addRegistration, getCamp, priceFor, spotsLeft } from "@/lib/store";

export type FormState = { ok: boolean; error?: string; message?: string };

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function submitContact(_: FormState, f: FormData): Promise<FormState> {
  const name = str(f, "name");
  const email = str(f, "email");
  const message = str(f, "message");
  if (!name || !emailOk(email) || !message) return { ok: false, error: "Please add your name, a valid email and a message." };
  addInquiry({ kind: "Message", from: `${name} <${email}>`, email, summary: `${str(f, "topic")}: ${message}` });
  return { ok: true };
}

export async function submitParty(_: FormState, f: FormData): Promise<FormState> {
  const name = str(f, "name");
  const email = str(f, "email");
  if (!name || !emailOk(email)) return { ok: false, error: "Please add your name and a valid email." };
  const bits = [str(f, "type"), str(f, "date") && `on ${str(f, "date")}`, str(f, "guests") && `${str(f, "guests")} guests`, str(f, "ages") && `ages ${str(f, "ages")}`, str(f, "notes")]
    .filter(Boolean)
    .join(" · ");
  addInquiry({ kind: "Party request", from: `${name} <${email}>`, email, summary: bits });
  return { ok: true };
}

export type RegistrationInput = {
  campId: string;
  campers: { first: string; last: string; age: string; notes: string }[];
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  emergencyName: string;
  emergencyPhone: string;
  pickup: string;
  textOptIn: boolean;
  waiverSigned: boolean;
  photoConsent: string;
};

export type RegistrationResult = { ok: true; id: string; totalCents: number } | { ok: false; error: string };

// Demo checkout: records the registration as "Paid (demo)". Real card payments
// (Stripe Checkout) replace this step once a Stripe account is connected.
export async function completeRegistration(input: RegistrationInput): Promise<RegistrationResult> {
  const camp = getCamp(input.campId);
  if (!camp || !camp.published) return { ok: false, error: "That camp is no longer available." };
  const campers = input.campers.filter((c) => c.first.trim() && c.last.trim());
  if (campers.length === 0) return { ok: false, error: "Add at least one camper." };
  if (!emailOk(input.parentEmail.trim()) || !input.parentName.trim()) return { ok: false, error: "Add a parent name and a valid email." };
  if (!input.waiverSigned) return { ok: false, error: "Please agree to the waiver to continue." };
  if (campers.length > spotsLeft(camp)) return { ok: false, error: `Only ${spotsLeft(camp)} spot(s) left in this camp.` };

  const reg = addRegistration({
    campId: camp.id,
    campers,
    parentName: input.parentName.trim(),
    parentEmail: input.parentEmail.trim(),
    parentPhone: input.parentPhone.trim(),
    emergencyName: input.emergencyName.trim(),
    emergencyPhone: input.emergencyPhone.trim(),
    pickup: input.pickup.trim(),
    textOptIn: input.textOptIn,
    waiverSigned: true,
    photoConsent: input.photoConsent,
    totalCents: priceFor(camp, campers.length),
  });
  return { ok: true, id: reg.id, totalCents: reg.totalCents };
}
