import { AdminShell } from "@/components/AdminShell";

const msgs = [
  ["Registration confirmation", "Right after signup"],
  ["Waiver reminder", "2 days after signup, if the waiver is unsigned"],
  ["What to bring", "7 days before camp starts"],
  ["Day-before reminder", "1 day before camp starts"],
  ["Waitlist spot opened", "When a spot frees up"],
  ["Thank you & next camp", "1 day after camp ends"],
];

export default function Reminders() {
  return (
    <AdminShell current="/admin/reminders">
      <div>
        <h1>Reminders &amp; messages</h1>
        <p className="muted">These will go out automatically for every camp once email sending is connected.</p>
      </div>
      <div className="notice" style={{ padding: 0 }}>
        {msgs.map(([name, when]) => (
          <div key={name} style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", alignItems: "center", padding: "18px 22px", borderBottom: "1px solid #efe7da" }}>
            <div style={{ flex: "1 1 260px" }}><div style={{ fontWeight: 600 }}>{name}</div><div className="small">{when}</div></div>
            <span className="pill">Email</span>
            <span className="pill">Not connected yet</span>
          </div>
        ))}
      </div>
      <p className="small">Email delivery (Resend or Postmark) is the next integration. Families can already opt in to texts at registration.</p>
    </AdminShell>
  );
}
