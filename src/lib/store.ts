// Data access for Sunbeam, backed by Cloudflare D1 (binding "DB"). Schema: migrations/.

export type Camp = {
  id: string;
  name: string;
  kind: "Summer camp" | "Multi-week program" | "One-day event";
  season: "Summer" | "Fall";
  where: string;
  dates: string;
  time: string;
  ages: string;
  priceCents: number;
  capacity: number;
  siblingDiscountPct: number;
  blurb: string;
  image: string;
  imagePos: string;
  published: boolean;
};

export type Registration = {
  id: string;
  campId: string;
  createdAt: string;
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
  totalCents: number;
  status: "pending" | "paid" | "expired" | "refunded";
};

export type Inquiry = {
  id: string;
  kind: "Message" | "Party request";
  from: string;
  email: string;
  summary: string;
  createdAt: string;
  done: boolean;
};

import { getCloudflareContext } from "@opennextjs/cloudflare";

async function db(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

const uid = () => crypto.randomUUID().replace(/-/g, "").slice(0, 12);
const bool = (n: unknown) => n === 1 || n === true;

export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);

type EventRow = Record<string, string | number | null>;
const toCamp = (r: EventRow): Camp => ({
  id: String(r.id),
  name: String(r.name),
  kind: r.kind as Camp["kind"],
  season: r.season as Camp["season"],
  where: String(r.location),
  dates: String(r.dates),
  time: String(r.time_text),
  ages: String(r.ages),
  priceCents: Number(r.price_cents),
  capacity: Number(r.capacity),
  siblingDiscountPct: Number(r.sibling_discount_pct),
  blurb: String(r.blurb),
  image: String(r.image),
  imagePos: String(r.image_pos),
  published: bool(r.published),
});

export async function listCamps(includeDrafts = false): Promise<Camp[]> {
  const sql = `SELECT * FROM events ${includeDrafts ? "" : "WHERE published = 1"} ORDER BY sort_order, created_at`;
  const { results } = await (await db()).prepare(sql).all<EventRow>();
  return results.map(toCamp);
}

export async function getCamp(id: string): Promise<Camp | undefined> {
  const r = await (await db()).prepare("SELECT * FROM events WHERE id = ?").bind(id).first<EventRow>();
  return r ? toCamp(r) : undefined;
}

// Seats taken: campers on paid registrations, plus campers on unexpired pending holds.
const FILLED_SQL = `
  SELECT COUNT(c.id) AS n FROM campers c JOIN registrations r ON r.id = c.registration_id
  WHERE r.event_id = ? AND (r.status = 'paid' OR (r.status = 'pending' AND r.hold_expires_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now')))`;

export async function filledSpots(campId: string): Promise<number> {
  const r = await (await db()).prepare(FILLED_SQL).bind(campId).first<{ n: number }>();
  return r?.n ?? 0;
}

export async function filledSpotsByCamp(): Promise<Record<string, number>> {
  const { results } = await (await db())
    .prepare(
      `SELECT r.event_id AS id, COUNT(c.id) AS n FROM campers c JOIN registrations r ON r.id = c.registration_id
       WHERE r.status = 'paid' OR (r.status = 'pending' AND r.hold_expires_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
       GROUP BY r.event_id`,
    )
    .all<{ id: string; n: number }>();
  return Object.fromEntries(results.map((r) => [r.id, r.n]));
}

export async function spotsLeft(c: Camp): Promise<number> {
  return Math.max(0, c.capacity - (await filledSpots(c.id)));
}

export function priceFor(c: Camp, campers: number) {
  const first = c.priceCents;
  const rest = Math.round(c.priceCents * (1 - c.siblingDiscountPct / 100));
  return first + Math.max(0, campers - 1) * rest;
}

export async function saveCamp(input: Omit<Camp, "id"> & { id?: string }) {
  const d = await db();
  const id = input.id ?? `camp-${uid()}`;
  await d
    .prepare(
      `INSERT INTO events (id, name, kind, season, location, dates, time_text, ages, price_cents, capacity, sibling_discount_pct, blurb, image, image_pos, published, sort_order)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM events))
       ON CONFLICT(id) DO UPDATE SET name = ?2, kind = ?3, season = ?4, location = ?5, dates = ?6, time_text = ?7, ages = ?8, price_cents = ?9,
         capacity = ?10, sibling_discount_pct = ?11, blurb = ?12, image = ?13, image_pos = ?14, published = ?15`,
    )
    .bind(id, input.name, input.kind, input.season, input.where, input.dates, input.time, input.ages, input.priceCents, input.capacity, input.siblingDiscountPct, input.blurb, input.image, input.imagePos, input.published ? 1 : 0)
    .run();
  return id;
}

type NewRegistration = Omit<Registration, "id" | "createdAt" | "status">;

// Demo checkout: records a paid registration with no card charge. Stripe replaces this in phase 4.
export async function addRegistration(r: NewRegistration): Promise<Registration> {
  const d = await db();
  const id = uid();
  const createdAt = new Date().toISOString();
  const stmts = [
    d
      .prepare(
        `INSERT INTO registrations (id, event_id, status, parent_name, parent_email, parent_phone, emergency_name, emergency_phone, pickup, text_opt_in, photo_consent, waiver_signed_at, total_cents, created_at)
         VALUES (?, ?, 'paid', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, r.campId, r.parentName, r.parentEmail, r.parentPhone, r.emergencyName, r.emergencyPhone, r.pickup, r.textOptIn ? 1 : 0, r.photoConsent, r.waiverSigned ? createdAt : null, r.totalCents, createdAt),
    ...r.campers.map((c, i) =>
      d.prepare("INSERT INTO campers (id, registration_id, first, last, age, notes, position) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(uid(), id, c.first, c.last, c.age, c.notes, i),
    ),
  ];
  await d.batch(stmts);
  return { ...r, id, createdAt, status: "paid" };
}

export async function listRegistrations(campId?: string): Promise<Registration[]> {
  const d = await db();
  const base = "SELECT * FROM registrations";
  const { results } = await (campId
    ? d.prepare(`${base} WHERE event_id = ? ORDER BY created_at DESC`).bind(campId)
    : d.prepare(`${base} ORDER BY created_at DESC`)
  ).all<EventRow>();
  if (!results.length) return [];
  const { results: kids } = await d
    .prepare("SELECT registration_id, first, last, age, notes FROM campers ORDER BY registration_id, position")
    .all<{ registration_id: string; first: string; last: string; age: string; notes: string }>();
  return results.map((r) => ({
    id: String(r.id),
    campId: String(r.event_id),
    createdAt: String(r.created_at),
    campers: kids.filter((k) => k.registration_id === r.id).map(({ first, last, age, notes }) => ({ first, last, age, notes })),
    parentName: String(r.parent_name),
    parentEmail: String(r.parent_email),
    parentPhone: String(r.parent_phone),
    emergencyName: String(r.emergency_name),
    emergencyPhone: String(r.emergency_phone),
    pickup: String(r.pickup),
    textOptIn: bool(r.text_opt_in),
    waiverSigned: r.waiver_signed_at != null,
    photoConsent: String(r.photo_consent),
    totalCents: Number(r.total_cents),
    status: r.status as Registration["status"],
  }));
}

// Marks a registration refunded in the database. Phase 4 also calls Stripe's refund API first.
export async function refundRegistration(id: string) {
  await (await db()).prepare("UPDATE registrations SET status = 'refunded' WHERE id = ? AND status = 'paid'").bind(id).run();
}

export async function addInquiry(i: Omit<Inquiry, "id" | "createdAt" | "done">) {
  const name = i.from.replace(/\s*<[^>]*>\s*$/, "") || i.from;
  await (await db())
    .prepare("INSERT INTO inquiries (id, kind, name, email, summary) VALUES (?, ?, ?, ?, ?)")
    .bind(uid(), i.kind === "Message" ? "message" : "party_request", name, i.email, i.summary)
    .run();
}

export async function listInquiries(): Promise<Inquiry[]> {
  const { results } = await (await db()).prepare("SELECT * FROM inquiries ORDER BY created_at DESC").all<EventRow>();
  return results.map((r) => ({
    id: String(r.id),
    kind: r.kind === "message" ? "Message" : "Party request",
    from: `${r.name} <${r.email}>`,
    email: String(r.email),
    summary: String(r.summary),
    createdAt: String(r.created_at),
    done: bool(r.done),
  }));
}

export async function toggleInquiry(id: string) {
  await (await db()).prepare("UPDATE inquiries SET done = 1 - done WHERE id = ?").bind(id).run();
}
