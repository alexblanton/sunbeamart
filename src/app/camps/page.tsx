import Link from "next/link";
import { Page } from "@/components/SiteChrome";
import { CampsList, type CampCard } from "@/components/CampsList";
import { filledSpotsByCamp, listCamps, money } from "@/lib/store";

export const metadata = { title: "Camps & Events" };
export const dynamic = "force-dynamic";

export default async function Camps() {
  const filledBy = await filledSpotsByCamp();
  const camps: CampCard[] = (await listCamps()).map((c) => ({
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
    spotsLeft: Math.max(0, c.capacity - (filledBy[c.id] ?? 0)),
  }));
  return (
    <Page current="/camps">
      <section className="wrap page-intro" style={{ paddingBottom: 0 }}>
        <h1 className="page-title">Camps &amp; Events</h1>
        <p className="lead">
          Hands-on camps and multi-week programs where kids experiment freely. Pick one, then register and pay in a few minutes.
        </p>
      </section>
      <section className="wrap" style={{ paddingBottom: 72 }}>
        <CampsList camps={camps} />
      </section>
      <section className="band">
        <div className="wrap section">
          <div className="cta-row">
            <div>
              <h2>Planning a party instead?</h2>
              <p className="muted">Themed art parties and Neighborhood Art Parties, tailored to your group.</p>
            </div>
            <Link href="/parties" className="btn outline">Ask about a party</Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
