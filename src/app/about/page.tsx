import Link from "next/link";
import { Page } from "@/components/SiteChrome";

export const metadata = { title: "About" };

export default function About() {
  return (
    <Page current="/about">
      <section className="wrap" style={{ padding: "80px 24px 64px", display: "flex", flexDirection: "column", gap: 20 }}>
        <p className="eyebrow">About Sunbeam</p>
        <h1 style={{ maxWidth: 820, fontSize: "clamp(38px, 5vw, 58px)", lineHeight: 1.1 }}>We believe that everyone can find their creative spark.</h1>
        <p className="muted" style={{ maxWidth: 680, fontSize: 19 }}>
          Sunbeam Art House offers unique art activities built around experimentation and freedom, and we hope whole families will create together.
        </p>
      </section>

      <section className="band" aria-label="Our approach">
        <div className="wrap" style={{ padding: "80px 24px", display: "flex", flexWrap: "wrap", gap: 56, alignItems: "center" }}>
          <img src="/images/process-art-stock.jpg" alt="A little girl doing process art at a table" style={{ flex: "1 1 380px", minWidth: 0, width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: "160px 160px 8px 8px" }} />
          <div style={{ flex: "1 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 className="title" style={{ fontWeight: 400, fontSize: 44 }}>Process art vs. product art</h2>
            <p style={{ fontSize: 20, fontFamily: "var(--serif)" }}>We value the artist's journey over the end result.</p>
            <p className="muted">
              The process helps us learn about ourselves and each other. We are not here to focus on perfection or comparison. We encourage everyone to experiment and learn from the experience.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 8 }}>
              <div className="notice" style={{ padding: 20 }}><strong style={{ display: "block", marginBottom: 4 }}>Process art</strong><span className="muted" style={{ fontSize: 15 }}>Open-ended, child-led, no "right" answer. Every piece looks different.</span></div>
              <div className="notice" style={{ padding: 20 }}><strong style={{ display: "block", marginBottom: 4 }}>Product art</strong><span className="muted" style={{ fontSize: 15 }}>Follow-the-steps crafts that all end up looking the same.</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap" aria-label="Meet the founder" style={{ padding: "88px 24px", display: "flex", flexWrap: "wrap", gap: 48, alignItems: "center" }}>
        <img src="/images/around-the-world.jpg" alt="Sunbeam's founder smiling while holding a paper craft in front of a colorful tapestry" style={{ flex: "0 0 240px", width: 240, height: 240, borderRadius: "50%", objectFit: "cover" }} />
        <div style={{ flex: "1 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
          <h2 style={{ fontWeight: 400, fontSize: 40 }}>Meet [FOUNDER NAME]</h2>
          <p className="muted">[A few sentences about the founder: background in art or teaching, why Sunbeam started, and what a day at camp feels like.]</p>
          <p className="muted">We partner with local spaces like Mt. Sequoyah, Iris Art Haus, Ozark Smoke House and the Medium to bring art to the community.</p>
        </div>
      </section>

      <section style={{ background: "var(--ink)", color: "var(--cream)" }}>
        <div className="wrap" style={{ padding: "64px 24px", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontWeight: 400, fontSize: 34, marginBottom: 6 }}>Interested in working together?</h2>
            <p style={{ color: "#cfc4b4" }}>Schools, venues and organizations: send us a message.</p>
          </div>
          <Link href="/contact" className="btn light">Send us a message</Link>
        </div>
      </section>
    </Page>
  );
}
