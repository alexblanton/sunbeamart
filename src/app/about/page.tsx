import Link from "next/link";
import { Page } from "@/components/SiteChrome";

export const metadata = { title: "About" };

export default function About() {
  return (
    <Page current="/about">
      <section className="wrap page-intro">
        <p className="eyebrow">About Sunbeam</p>
        <h1 className="page-title" style={{ maxWidth: 820 }}>We believe that everyone can find their creative spark.</h1>
        <p className="lead">
          Sunbeam Art House offers unique art activities built around experimentation and freedom, and we hope whole families will create together.
        </p>
      </section>

      <section className="band" aria-label="Our approach">
        <div className="wrap section media-split">
          <img className="arch" src="/images/process-art-stock.jpg" alt="A little girl doing process art at a table" />
          <div className="stack" style={{ gap: 18 }}>
            <h2 className="section-title">Process art vs. product art</h2>
            <p className="serif-lead">We value the artist's journey over the end result.</p>
            <p className="muted">
              The process helps us learn about ourselves and each other. We are not here to focus on perfection or comparison. We encourage everyone to experiment and learn from the experience.
            </p>
            <div className="compare">
              <div className="notice"><strong style={{ display: "block", marginBottom: 4 }}>Process art</strong><span className="muted" style={{ fontSize: 15 }}>Open-ended, child-led, no "right" answer. Every piece looks different.</span></div>
              <div className="notice"><strong style={{ display: "block", marginBottom: 4 }}>Product art</strong><span className="muted" style={{ fontSize: 15 }}>Follow-the-steps crafts that all end up looking the same.</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap section founder" aria-label="Meet the founder">
        <img src="/images/around-the-world.jpg" alt="Sunbeam's founder smiling while holding a paper craft in front of a colorful tapestry" />
        <div className="stack">
          <h2 className="section-title">Meet [FOUNDER NAME]</h2>
          <p className="muted">[A few sentences about the founder: background in art or teaching, why Sunbeam started, and what a day at camp feels like.]</p>
          <p className="muted">We partner with local spaces like Mt. Sequoyah, Iris Art Haus, Ozark Smoke House and the Medium to bring art to the community.</p>
        </div>
      </section>

      <section className="band dark">
        <div className="wrap section">
          <div className="cta-row">
            <div>
              <h2>Interested in working together?</h2>
              <p className="muted">Schools, venues and organizations: send us a message.</p>
            </div>
            <Link href="/contact" className="btn light">Send us a message</Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
