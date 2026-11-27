// In-memory demo store. Data resets when the server restarts.
// Swap this module for Supabase once the demo is approved.

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
  status: "Paid (demo)" | "Refunded";
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

type Db = { camps: Camp[]; registrations: Registration[]; inquiries: Inquiry[] };

const seedCamps: Camp[] = [
  {
    id: "around-the-world",
    name: "Art from Around the World",
    kind: "Multi-week program",
    season: "Fall",
    where: "Mt. Sequoyah",
    dates: "Sep 23 – Oct 28",
    time: "[TIME]",
    ages: "[AGES]",
    priceCents: 18000,
    capacity: 12,
    siblingDiscountPct: 10,
    blurb: "Join us for a 6-week creative adventure around the world! Each week explores a different culture through a hands-on craft and the traditions behind it.",
    image: "/images/around-the-world.jpg",
    imagePos: "50% 35%",
    published: true,
  },
  {
    id: "summer-iris",
    name: "Kids Summer Camp",
    kind: "Summer camp",
    season: "Summer",
    where: "Iris Art Haus",
    dates: "June 2–4",
    time: "9:30 am – noon",
    ages: "[AGES]",
    priceCents: 9500,
    capacity: 12,
    siblingDiscountPct: 10,
    blurb: "Three mornings of painting, collage and making.",
    image: "/images/summer-camps.jpg",
    imagePos: "50% 40%",
    published: true,
  },
  {
    id: "summer-ozark",
    name: "Kids Summer Camp",
    kind: "Summer camp",
    season: "Summer",
    where: "Ozark Smoke House",
    dates: "June 23–25",
    time: "9:30 am – noon",
    ages: "[AGES]",
    priceCents: 9500,
    capacity: 12,
    siblingDiscountPct: 10,
    blurb: "Three mornings of painting, collage and making.",
    image: "/images/neighborhood-party.jpg",
    imagePos: "50% 60%",
    published: true,
  },
  {
    id: "summer-medium",
    name: "Kids Summer Camp",
    kind: "Summer camp",
    season: "Summer",
    where: "The Medium",
    dates: "July 28–30",
    time: "9:30 am – noon",
    ages: "[AGES]",
    priceCents: 9500,
    capacity: 12,
    siblingDiscountPct: 10,
    blurb: "Three mornings of painting, collage and making.",
    image: "/images/art-parties.jpg",
    imagePos: "50% 40%",
    published: false,
  },
];

const g = globalThis as unknown as { __sunbeamDb?: Db };
const db: Db = (g.__sunbeamDb ??= { camps: seedCamps, registrations: [], inquiries: [] });

const uid = () => Math.random().toString(36).slice(2, 10);

export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);

export const listCamps = (includeDrafts = false) =>
  db.camps.filter((c) => includeDrafts || c.published);
export const getCamp = (id: string) => db.camps.find((c) => c.id === id);

export const filledSpots = (campId: string) =>
  db.registrations
    .filter((r) => r.campId === campId && r.status !== "Refunded")
    .reduce((n, r) => n + r.campers.length, 0);

export const spotsLeft = (c: Camp) => Math.max(0, c.capacity - filledSpots(c.id));

export function priceFor(c: Camp, campers: number) {
  const first = c.priceCents;
  const rest = Math.round(c.priceCents * (1 - c.siblingDiscountPct / 100));
  return first + Math.max(0, campers - 1) * rest;
}

export function saveCamp(input: Omit<Camp, "id"> & { id?: string }) {
  if (input.id) {
    const i = db.camps.findIndex((c) => c.id === input.id);
    if (i >= 0) {
      db.camps[i] = { ...db.camps[i], ...input, id: input.id };
      return db.camps[i];
    }
  }
  const camp: Camp = { ...input, id: `camp-${uid()}` };
  db.camps.push(camp);
  return camp;
}

export function addRegistration(r: Omit<Registration, "id" | "createdAt" | "status">) {
  const reg: Registration = { ...r, id: uid(), createdAt: new Date().toISOString(), status: "Paid (demo)" };
  db.registrations.unshift(reg);
  return reg;
}
export const listRegistrations = (campId?: string) =>
  db.registrations.filter((r) => !campId || r.campId === campId);
export function refundRegistration(id: string) {
  const r = db.registrations.find((x) => x.id === id);
  if (r) r.status = "Refunded";
}

export function addInquiry(i: Omit<Inquiry, "id" | "createdAt" | "done">) {
  db.inquiries.unshift({ ...i, id: uid(), createdAt: new Date().toISOString(), done: false });
}
export const listInquiries = () => db.inquiries;
export function toggleInquiry(id: string) {
  const q = db.inquiries.find((x) => x.id === id);
  if (q) q.done = !q.done;
}
