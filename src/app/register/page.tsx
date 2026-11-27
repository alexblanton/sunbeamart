import Link from "next/link";
import { Page } from "@/components/SiteChrome";
import { RegisterWizard } from "@/components/RegisterWizard";
import { getCamp, listCamps, spotsLeft } from "@/lib/store";

export const metadata = { title: "Register" };
export const dynamic = "force-dynamic";

export default async function Register({ searchParams }: { searchParams: Promise<{ camp?: string }> }) {
  const { camp: id } = await searchParams;
  const camp = (id && (await getCamp(id))) || (await listCamps())[0];
  const left = camp ? await spotsLeft(camp) : 0;
  return (
    <Page current="/camps">
      <div className="wrap" style={{ paddingTop: 12, paddingBottom: 72 }}>
        <p style={{ marginBottom: 8 }}><Link href="/camps" className="back-link">← Back to camps &amp; events</Link></p>
        {camp && camp.published && left > 0 ? (
          <RegisterWizard
            key={camp.id}
            campId={camp.id}
            campName={camp.name}
            campMeta={`${camp.where} · ${camp.dates}${camp.time.startsWith("[") ? "" : ` · ${camp.time}`}`}
            image={camp.image}
            priceCents={camp.priceCents}
            siblingPct={camp.siblingDiscountPct}
            spotsLeft={left}
          />
        ) : (
          <div className="notice">
            <h1 style={{ fontSize: 30 }}>This camp is full.</h1>
            <p className="muted" style={{ margin: "8px 0 16px" }}>Contact us to join the waitlist, or pick another camp.</p>
            <Link href="/camps" className="btn block-sm">See camps</Link>
          </div>
        )}
      </div>
    </Page>
  );
}
