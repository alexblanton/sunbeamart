import { AdminShell } from "@/components/AdminShell";
import { refundAction } from "@/app/admin/actions";
import { getCamp, listCamps, listRegistrations, money } from "@/lib/store";

export default async function Registrations({ searchParams }: { searchParams: Promise<{ camp?: string }> }) {
  const { camp: campId } = await searchParams;
  const regs = listRegistrations(campId);
  const camp = campId ? getCamp(campId) : undefined;
  return (
    <AdminShell current="/admin/registrations">
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <div>
          <h1>Registrations</h1>
          <p className="muted">{camp ? `${camp.name} · ${camp.where} · ${camp.dates}` : "All camps"}</p>
        </div>
        <form style={{ display: "flex", gap: 10 }}>
          <label htmlFor="camp" style={{ position: "absolute", left: -9999 }}>Choose camp</label>
          <select id="camp" name="camp" defaultValue={campId ?? ""} style={{ width: "auto" }}>
            <option value="">All camps</option>
            {listCamps(true).map((c) => <option key={c.id} value={c.id}>{c.name} · {c.where}</option>)}
          </select>
          <button className="btn outline small" style={{ minHeight: 48 }}>Filter</button>
        </form>
      </div>
      {regs.length === 0 ? (
        <div className="notice"><h3>No registrations yet.</h3><p className="muted">Register a camper on the public site and they'll show up here.</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Campers</th><th>Parent</th><th>Notes</th><th>Texts</th><th>Total</th><th>Status</th><th><span style={{ position: "absolute", left: -9999 }}>Actions</span></th></tr></thead>
            <tbody>
              {regs.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.campers.map((c) => `${c.first} ${c.last} (${c.age})`).join(", ")}</strong><div className="small">{getCamp(r.campId)?.where}</div></td>
                  <td>{r.parentName}<div className="small">{r.parentEmail}</div></td>
                  <td className="muted">{r.campers.map((c) => c.notes).filter(Boolean).join("; ") || "—"}{r.pickup ? <div className="small">Pickup: {r.pickup}</div> : null}</td>
                  <td>{r.textOptIn ? "Opted in" : "No"}</td>
                  <td>{money(r.totalCents)}</td>
                  <td><span className={`pill ${r.status === "Refunded" ? "" : "ok"}`}>{r.status}</span></td>
                  <td style={{ textAlign: "right" }}>
                    {r.status !== "Refunded" && (
                      <form action={refundAction}><input type="hidden" name="id" value={r.id} /><button className="btn outline small">Refund</button></form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="small">Demo data lives in memory and resets when the server restarts. Refunds will go back to the family's card through Stripe once payments are connected.</p>
    </AdminShell>
  );
}
