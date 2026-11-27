import { AdminShell } from "@/components/AdminShell";
import { toggleInquiryAction } from "@/app/admin/actions";
import { listInquiries } from "@/lib/store";

export default async function Requests() {
  const items = await listInquiries();
  return (
    <AdminShell current="/admin/requests">
      <div>
        <h1>Requests &amp; messages</h1>
        <p className="muted">Party requests and contact form messages land here.</p>
      </div>
      {items.length === 0 ? (
        <div className="notice"><h3>Nothing yet.</h3><p className="muted">Send a message from the Contact or Art Parties page to see it appear here.</p></div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((q) => (
            <article key={q.id} className={`notice request${q.done ? " done" : ""}`}>
              <span style={{ alignSelf: "flex-start" }} className={`pill ${q.kind === "Party request" ? "warn" : "ok"}`}>{q.kind}</span>
              <div className="who">
                <div style={{ fontWeight: 600 }}>{q.from}</div>
                <div className="muted" style={{ fontSize: 15 }}>{q.summary}</div>
              </div>
              <span className="small">{new Date(q.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
              <div className="actions">
                <a className="btn dark small" href={`mailto:${q.email}`}>Reply</a>
                <form action={toggleInquiryAction}><input type="hidden" name="id" value={q.id} /><button className="btn outline small">{q.done ? "Reopen" : "Mark done"}</button></form>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
