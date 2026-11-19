import Link from "next/link";
import { logout } from "@/app/admin/actions";

const tabs = [
  { href: "/admin", label: "Camps & Events" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/reminders", label: "Reminders" },
];

export function AdminShell({ current, children }: { current: string; children: React.ReactNode }) {
  return (
    <div className="admin">
      <aside>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px" }}>
          <img src="/images/logo.jpg" alt="Sunbeam Art House" width={56} height={56} style={{ mixBlendMode: "multiply" }} />
          <span className="eyebrow" style={{ color: "var(--faint)", fontSize: 13, letterSpacing: "0.1em" }}>Admin</span>
        </div>
        <nav aria-label="Admin sections">
          {tabs.map((t) => (
            <Link key={t.href} href={t.href} aria-current={current === t.href ? "page" : undefined}>{t.label}</Link>
          ))}
        </nav>
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8, padding: "0 8px" }}>
          <Link href="/" style={{ fontSize: 14, fontWeight: 600 }}>View the website ↗</Link>
          <form action={logout}><button className="btn outline small" type="submit">Sign out</button></form>
        </div>
      </aside>
      <main>{children}</main>
    </div>
  );
}
