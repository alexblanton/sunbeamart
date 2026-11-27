import Link from "next/link";
import { Page } from "@/components/SiteChrome";
import { CampsList, type CampCard } from "@/components/CampsList";
import { listCamps, money, spotsLeft } from "@/lib/store";

export const metadata = { title: "Camps & Events" };
export const dynamic = "force-dynamic";

export default function Camps() {
  const camps: CampCard[] = listCamps().map((c) => ({
    id: c.id,
    name: c.name,
    kind: c.kind,
    season: c.season,
    where: c.where,
    dates: c.dates,
    time: c.time,
    ages: c.ages,
    price: money(c.priceCents),
    blurb: c.blurb,
    image: c.image,
    imagePos: c.imagePos,
    spotsLeft: spotsLeft(c),
  }));
  return (
    <Page current="/camps">
      <section className="wrap" style={{ padding: "72px 24px 96px" }}>
        <h1 style={{ fontSize: "clamp(40px, 5vw, 60px)", marginBottom: 16 }}>Camps &amp; Events</h1>
        <p className="muted" style={{ maxWidth: 620, fontSize: 19 }}>
          Hands-on camps and multi-week programs where kids experiment freely. Pick one, then register and pay in a few minutes.
        </p>
        <CampsList camps={camps} />
      </section>
      <section className="band">
        <div className="wrap" style={{ padding: "56px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <div>
            <h2 style={{ fontWeight: 400, fontSize: 32, marginBottom: 4 }}>Planning a party instead?</h2>
            <p className="muted">Themed art parties and Neighborhood Art Parties, tailored to your group.</p>
          </div>
          <Link href="/parties" className="btn outline">Ask about a party</Link>
        </div>
      </section>
    </Page>
  );
}
