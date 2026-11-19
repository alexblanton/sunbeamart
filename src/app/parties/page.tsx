import { Page } from "@/components/SiteChrome";
import { PartyForm } from "@/components/InquiryForm";

export const metadata = { title: "Art Parties" };

const steps = [
  ["Tell us about your party", "Share the date, place, number of guests and any theme ideas."],
  ["We send a plan and quote", "You'll get a project idea, timing and price within [X] days."],
  ["Book and create", "Pay a deposit online to hold your date, then we set up and get making."],
];

export default function Parties() {
  return (
    <Page current="/parties">
      <section className="hero short" aria-label="Art parties">
        <img src="/images/art-parties.jpg" alt="Kids making art together at a long table" style={{ objectPosition: "50% 40%" }} />
        <div className="wrap">
          <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)" }}>Host an art party at your place</h1>
          <p>We bring the materials, the ideas and the mess-friendly setup. You bring the guests.</p>
        </div>
      </section>

      <section className="wrap grid-camps" style={{ padding: "72px 24px" }} aria-label="Party options">
        <article className="card">
          <img className="cover" style={{ height: 260, objectPosition: "50% 60%" }} src="/images/neighborhood-party.jpg" alt="Neighborhood kids drawing a chalk mural on a driveway" />
          <div className="body">
            <h2 style={{ fontSize: 30 }}>Neighborhood Art Party</h2>
            <p className="muted">Let us set up an interactive art party in your front yard. Perfect for a block party or a neighbor get-together, with something for every age.</p>
            <ul className="muted" style={{ margin: 0, paddingLeft: 20, fontSize: 16 }}>
              <li>Outdoor stations for kids and grown-ups</li>
              <li>All materials and cleanup included</li>
              <li>[DURATION] · up to [N] guests · from [PRICE]</li>
            </ul>
            <div style={{ marginTop: "auto", paddingTop: 8 }}><a className="btn" href="#party-form">Request a date</a></div>
          </div>
        </article>
        <article className="card">
          <img className="cover" style={{ height: 260 }} src="/images/summer-camps.jpg" alt="Close-up of a child painting with watercolors" />
          <div className="body">
            <h2 style={{ fontSize: 30 }}>Themed Party Packages</h2>
            <p className="muted">Birthdays, showers and celebrations of all kinds. We tailor a themed art project to your party and guests.</p>
            <ul className="muted" style={{ margin: 0, paddingLeft: 20, fontSize: 16 }}>
              <li>Themes such as [THEME], [THEME] and [THEME]</li>
              <li>Each guest takes home a finished piece</li>
              <li>[DURATION] · up to [N] guests · from [PRICE]</li>
            </ul>
            <div style={{ marginTop: "auto", paddingTop: 8 }}><a className="btn" href="#party-form">Plan a party</a></div>
          </div>
        </article>
      </section>

      <section className="band" aria-label="How it works">
        <div className="wrap section">
          <h2 className="title" style={{ marginBottom: 32 }}>How it works</h2>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 28 }}>
            {steps.map(([t, d], i) => (
              <li key={t} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: 40, color: "var(--clay)" }}>{i + 1}</span>
                <strong style={{ fontSize: 19 }}>{t}</strong>
                <span className="muted">{d}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="party-form" className="wrap" style={{ padding: "80px 24px 96px", display: "flex", flexWrap: "wrap", gap: 48 }}>
        <div style={{ flex: "1 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 className="title">Request a party</h2>
          <p className="muted">No commitment yet. We'll follow up with ideas and a quote.</p>
        </div>
        <div style={{ flex: "2 1 480px", minWidth: 0 }}>
          <PartyForm />
        </div>
      </section>
    </Page>
  );
}
