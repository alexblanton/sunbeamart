import Link from "next/link";
import { Page } from "@/components/SiteChrome";
import { listCamps } from "@/lib/store";

export const dynamic = "force-dynamic";

const tiles = [
  { href: "/camps", img: "/images/summer-camps.jpg", title: "Camps & Events", text: "Summer camps and multi-week programs like Art from Around the World.", more: "See camps & register" },
  { href: "/parties", img: "/images/art-parties.jpg", title: "Art Parties", text: "Custom themed parties, or a Neighborhood Art Party right in your front yard.", more: "Plan a party" },
  { href: "/about", img: "/images/process-art-stock.jpg", title: "Our Approach", text: "Process over product: we value the artist's journey over the end result.", more: "About Sunbeam" },
];

export default async function Home() {
  const upcoming = await listCamps();
  return (
    <Page>
      <section className="hero" aria-label="Welcome">
        <img src="/images/hero-founder.jpg" alt="Sunbeam's founder smiling with arms open in a field of wildflowers" style={{ objectPosition: "50% 28%" }} />
        <div className="wrap">
          <p className="eyebrow">Art camps, parties &amp; events</p>
          <h1>Creative sunshine for your soul.</h1>
          <p>Hands-on art camps, parties and community events for kids and families, hosted at studios and spaces around town.</p>
          <div className="hero-actions">
            <Link href="/camps" className="btn block-sm">Find a camp</Link>
            <Link href="/parties" className="btn light block-sm">Plan a party</Link>
          </div>
        </div>
      </section>

      <section className="wrap section" aria-label="What we offer">
        <div className="grid-3">
          {tiles.map((t) => (
            <Link key={t.href} href={t.href} className="card tile">
              <img className="cover" src={t.img} alt="" />
              <div className="body">
                <h2>{t.title}</h2>
                <p className="muted">{t.text}</p>
                <span className="more">{t.more} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="wrap section">
          <div className="section-head">
            <h2 className="section-title">Coming up</h2>
            <Link href="/camps">View all camps &amp; events</Link>
          </div>
          <div className="upcoming">
            {upcoming.map((c) => (
              <div className="row" key={c.id}>
                <div className="date">{c.dates}</div>
                <div className="what">
                  <div className="name">{c.name}</div>
                  <div className="where">{c.where}{c.time.startsWith("[") ? "" : ` · ${c.time}`}</div>
                </div>
                <Link href={`/register?camp=${c.id}`} className="btn outline small" aria-label={`Register for ${c.name}, ${c.dates}`}>Register</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="cta-row">
          <div>
            <h2>Questions? Say hello.</h2>
            <p className="muted">We'll get back to you within [X] days.</p>
          </div>
          <Link href="/contact" className="btn">Send us a message</Link>
        </div>
      </section>
    </Page>
  );
}
