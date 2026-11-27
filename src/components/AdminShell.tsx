import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { currentAdmin } from "@/lib/auth";

const tabs = [
  { href: "/admin", label: "Camps & Events" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/reminders", label: "Reminders" },
];

export async function AdminShell({ current, children }: { current: string; children: React.ReactNode }) {
  const who = await currentAdmin();
  return (
    <div className="admin">
      <aside>
        <div className="admin-brand">
          <div>
            <img src="/images/logo.jpg" alt="Sunbeam Art House" width={56} height={56} />
            <span className="eyebrow">Admin</span>
          </div>
          <div className="admin-foot-sm">
            <Link href="/" className="small" style={{ fontWeight: 600 }}>Website ↗</Link>
            <form action={logout}><button className="btn outline small" type="submit">Sign out</button></form>
          </div>
        </div>
        <nav aria-label="Admin sections">
          {tabs.map((t) => (
            <Link key={t.href} href={t.href} aria-current={current === t.href ? "page" : undefined}>{t.label}</Link>
          ))}
        </nav>
        <div className="admin-foot">
          {who?.email && <span className="small" style={{ overflowWrap: "anywhere" }}>Signed in as {who.email}</span>}
          <Link href="/" style={{ fontSize: 14, fontWeight: 600 }}>View the website ↗</Link>
          <form action={logout}><button className="btn outline small" type="submit">Sign out</button></form>
        </div>
      </aside>
      <main>{children}</main>
    </div>
  );
}
