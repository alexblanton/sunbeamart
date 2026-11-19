import Link from "next/link";
import { Page } from "@/components/SiteChrome";
import { listCamps } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function Home() {
  const upcoming = listCamps();
  return (
    <Page>
      <section className="hero" aria-label="Welcome">
        <img src="/images/hero-founder.jpg" alt="Sunbeam's founder smiling with arms open in a field of wildflowers" style={{ objectPosition: "50% 28%" }} />
        <div className="wrap">
          <p className="eyebrow">Art camps, parties &amp; events</p>
          <h1>Creative sunshine for your soul.</h1>
          <p>Hands-on art camps, parties and community events for kids and families, hosted at studios and spaces around town.</p>
        </div>
      </section>

      <section className="wrap" style={{ padding: "48px 24px 96px" }} aria-label="What we offer">
        <div className="grid-3">
          <Link href="/camps" className="card">
            <img className="cover" src="/images/summer-camps.jpg" alt="" />
            <div className="body">
              <h2>Camps &amp; Events</h2>
              <p className="muted">Summer camps and multi-week programs like Art from Around the World.</p>
              <span className="more">See camps &amp; register →</span>
            </div>
          </Link>
          <Link href="/parties" className="card">
            <img className="cover" src="/images/art-parties.jpg" alt="" />
            <div className="body">
              <h2>Art Parties</h2>
              <p className="muted">Custom themed parties, or a Neighborhood Art Party right in your front yard.</p>
              <span className="more">Plan a party →</span>
            </div>
          </Link>
          <Link href="/about" className="card">
            <img className="cover" src="/images/process-art-stock.jpg" alt="" />
            <div className="body">
              <h2>Our Approach</h2>
              <p className="muted">Process over product: we value the artist's journey over the end result.</p>
              <span className="more">About Sunbeam →</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="band">
        <div className="wrap section">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 32 }}>
            <h2 className="title">Coming up</h2>
            <Link href="/camps" style={{ fontWeight: 600 }}>View all camps &amp; events</Link>
          </div>
          <div style={{ borderTop: "1px solid #dccfbc" }}>
            {upcoming.map((c) => (
              <div className="row" key={c.id}>
                <div className="date">{c.dates}</div>
                <div className="what">
                  <div style={{ fontWeight: 600, fontSize: 18 }}>{c.name}</div>
                  <div className="muted" style={{ fontSize: 15 }}>{c.where}{c.time.startsWith("[") ? "" : ` · ${c.time}`}</div>
                </div>
                <Link href={`/register?camp=${c.id}`} className="btn outline small">Register</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap section" style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 className="title" style={{ fontSize: 36 }}>Questions? Say hello.</h2>
          <p className="muted">We'll get back to you within [X] days.</p>
        </div>
        <Link href="/contact" className="btn">Send us a message</Link>
      </section>
    </Page>
  );
}
