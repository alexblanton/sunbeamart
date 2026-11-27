import { redirect } from "next/navigation";
import { adminMode, isAdmin } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin sign-in", robots: { index: false } };

export default async function Login() {
  const mode = adminMode();
  // With Cloudflare Access, Access shows its own sign-in screen before /admin loads.
  if (mode === "access" || (await isAdmin())) redirect("/admin");
  if (mode === "off")
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
        <div className="notice" style={{ maxWidth: 440 }}>
          <h1 style={{ fontSize: 26, marginBottom: 8 }}>Admin sign-in isn't set up yet</h1>
          <p className="muted">The admin area is locked until Cloudflare Access (or an admin password) is configured for this site.</p>
        </div>
      </div>
    );
  return <LoginForm demo={mode === "demo"} />;
}
