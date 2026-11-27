import { adminMode } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Not allowed", robots: { index: false } };

export default function Denied() {
  const access = adminMode() === "access";
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div className="notice stack" style={{ maxWidth: 440 }}>
        <h1 style={{ fontSize: 26 }}>You're not signed in as an admin</h1>
        <p className="muted">Open the admin from the site's main address and sign in with an approved email.</p>
        {access && <a className="btn outline" href="/cdn-cgi/access/logout">Sign out and try another email</a>}
        <a href="/">Back to the website</a>
      </div>
    </div>
  );
}
