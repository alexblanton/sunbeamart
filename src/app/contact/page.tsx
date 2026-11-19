import Link from "next/link";
import { Page } from "@/components/SiteChrome";
import { ContactForm } from "@/components/InquiryForm";

export const metadata = { title: "Contact" };

export default function Contact() {
  return (
    <Page current="/contact">
      <section className="wrap" style={{ padding: "80px 24px 96px", display: "flex", flexWrap: "wrap", gap: 56 }}>
        <div style={{ flex: "1 1 320px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
          <h1 style={{ fontSize: "clamp(40px, 5vw, 58px)" }}>Get in touch</h1>
          <p className="muted" style={{ fontSize: 19 }}>
            Interested in a scheduled class, or hoping to host your own? Send us a message and we'll reply within [X] days.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
            <Link href="/camps" style={{ fontWeight: 600 }}>Looking for camp dates? See Camps &amp; Events</Link>
            <Link href="/parties" style={{ fontWeight: 600 }}>Planning a party? Request one here</Link>
          </div>
        </div>
        <div style={{ flex: "2 1 520px", minWidth: 0 }}>
          <ContactForm />
        </div>
      </section>
    </Page>
  );
}
