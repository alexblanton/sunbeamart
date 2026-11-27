import Link from "next/link";
import { Page } from "@/components/SiteChrome";
import { ContactForm } from "@/components/InquiryForm";

export const metadata = { title: "Contact" };

export default function Contact() {
  return (
    <Page current="/contact">
      <section className="wrap page-intro split" style={{ paddingBottom: 72 }}>
        <div className="stack" style={{ gap: 16 }}>
          <h1 className="page-title">Get in touch</h1>
          <p className="lead">
            Interested in a scheduled class, or hoping to host your own? Send us a message and we'll reply within [X] days.
          </p>
          <div className="stack" style={{ gap: 0, paddingTop: 8, borderTop: "1px solid var(--line)" }}>
            <Link href="/camps" className="back-link">Looking for camp dates? See Camps &amp; Events</Link>
            <Link href="/parties" className="back-link">Planning a party? Request one here</Link>
          </div>
        </div>
        <ContactForm />
      </section>
    </Page>
  );
}
