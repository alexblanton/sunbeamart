import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { saveCampAction } from "@/app/admin/actions";
import { getCamp } from "@/lib/store";

const photos = [
  ["/images/summer-camps.jpg", "Watercolor painting"],
  ["/images/art-parties.jpg", "Kids at a long table"],
  ["/images/neighborhood-party.jpg", "Chalk mural"],
  ["/images/around-the-world.jpg", "World crafts"],
];

export default async function EditCamp({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const c = isNew ? undefined : getCamp(id);
  if (!isNew && !c) notFound();
  return (
    <AdminShell current="/admin">
      <div>
        <p style={{ marginBottom: 8 }}><Link href="/admin" style={{ fontWeight: 600, fontSize: 15 }}>← All camps</Link></p>
        <h1>{isNew ? "New camp or event" : "Edit camp or event"}</h1>
      </div>
      <form action={saveCampAction} className="form" style={{ maxWidth: 900 }}>
        {c && <input type="hidden" name="id" value={c.id} />}
        <div className="field full"><label htmlFor="name">Name</label><input id="name" name="name" defaultValue={c?.name} required /></div>
        <div className="field"><label htmlFor="kind">Type</label>
          <select id="kind" name="kind" defaultValue={c?.kind ?? "Summer camp"}><option>Summer camp</option><option>Multi-week program</option><option>One-day event</option></select></div>
        <div className="field"><label htmlFor="season">Season</label>
          <select id="season" name="season" defaultValue={c?.season ?? "Summer"}><option>Summer</option><option>Fall</option></select></div>
        <div className="field"><label htmlFor="where">Location</label><input id="where" name="where" defaultValue={c?.where} /></div>
        <div className="field"><label htmlFor="dates">Dates</label><input id="dates" name="dates" defaultValue={c?.dates} placeholder="e.g. June 2–4" /></div>
        <div className="field"><label htmlFor="time">Time</label><input id="time" name="time" defaultValue={c?.time} placeholder="e.g. 9:30 am – noon" /></div>
        <div className="field"><label htmlFor="ages">Ages</label><input id="ages" name="ages" defaultValue={c?.ages === "[AGES]" ? "" : c?.ages} placeholder="e.g. 5–10" /></div>
        <div className="field"><label htmlFor="price">Price per camper ($)</label><input id="price" name="price" inputMode="decimal" defaultValue={c ? c.priceCents / 100 : ""} /></div>
        <div className="field"><label htmlFor="capacity">Spots available</label><input id="capacity" name="capacity" type="number" min={1} defaultValue={c?.capacity ?? 12} /></div>
        <div className="field"><label htmlFor="sibling">Sibling discount (%)</label><input id="sibling" name="sibling" type="number" min={0} max={100} defaultValue={c?.siblingDiscountPct ?? 10} /></div>
        <div className="field"><label htmlFor="image">Photo</label>
          <select id="image" name="image" defaultValue={c?.image ?? photos[0][0]}>{photos.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          <span className="small">Photo uploads arrive with the database version.</span></div>
        <div className="field full"><label htmlFor="blurb">Short description</label><textarea id="blurb" name="blurb" rows={3} defaultValue={c?.blurb} /></div>
        <div className="field full" style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, paddingTop: 16, borderTop: "1px solid #efe7da" }}>
          <label className="check" style={{ alignItems: "center" }}><input type="checkbox" name="published" defaultChecked={c?.published ?? true} /> Published on the website</label>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/admin" className="btn outline">Cancel</Link>
            <button className="btn">Save</button>
          </div>
        </div>
      </form>
    </AdminShell>
  );
}
