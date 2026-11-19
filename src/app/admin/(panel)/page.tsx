import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { filledSpots, listCamps, listRegistrations, money } from "@/lib/store";

export default function AdminCamps() {
  const camps = listCamps(true);
  const regs = listRegistrations().filter((r) => r.status !== "Refunded");
  const collected = regs.reduce((n, r) => n + r.totalCents, 0);
  const open = camps.filter((c) => c.published).reduce((n, c) => n + Math.max(0, c.capacity - filledSpots(c.id)), 0);
  return (
    <AdminShell current="/admin">
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <div>
          <h1>Camps &amp; Events</h1>
          <p className="muted">Anything published here appears on the website right away.</p>
        </div>
        <Link href="/admin/camps/new" className="btn">+ Add camp or event</Link>
      </div>
      <div className="stats">
        <div className="stat"><div className="small">Registrations</div><div className="n">{regs.length}</div></div>
        <div className="stat"><div className="small">Collected (demo)</div><div className="n">{money(collected)}</div></div>
        <div className="stat"><div className="small">Open spots</div><div className="n">{open}</div></div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Camp or event</th><th>Dates</th><th>Spots filled</th><th>Price</th><th>Status</th><th><span style={{ position: "absolute", left: -9999 }}>Actions</span></th></tr>
          </thead>
          <tbody>
            {camps.map((c) => {
              const filled = filledSpots(c.id);
              const full = filled >= c.capacity;
              return (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <img src={c.image} alt="" width={48} height={48} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                      <div><div style={{ fontWeight: 600 }}>{c.name}</div><div className="small">{c.where}</div></div>
                    </div>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{c.dates}</td>
                  <td style={{ minWidth: 150 }}>
                    <div style={{ fontSize: 14, marginBottom: 6 }}>{filled} of {c.capacity}</div>
                    <div className="bar"><div style={{ width: `${Math.round((100 * filled) / c.capacity)}%` }} /></div>
                  </td>
                  <td>{money(c.priceCents)}</td>
                  <td><span className={`pill ${!c.published ? "" : full ? "warn" : "ok"}`}>{!c.published ? "Draft" : full ? "Full" : "Open"}</span></td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <Link href={`/admin/registrations?camp=${c.id}`} className="btn outline small">Sign-ups</Link>{" "}
                    <Link href={`/admin/camps/${c.id}`} className="btn dark small">Edit</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
