"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { completeRegistration, type RegistrationInput } from "@/app/actions";

type Props = {
  campId: string;
  campName: string;
  campMeta: string;
  image: string;
  priceCents: number;
  siblingPct: number;
  spotsLeft: number;
};

type Camper = { first: string; last: string; age: string; notes: string };
const blank = (): Camper => ({ first: "", last: "", age: "", notes: "" });

const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);

const labels = ["Camper", "Parent & pickup", "Waiver", "Review & pay"];

export function RegisterWizard(p: Props) {
  const [step, setStep] = useState(0);
  const [campers, setCampers] = useState<Camper[]>([blank()]);
  const [parent, setParent] = useState({ name: "", email: "", phone: "", emName: "", emPhone: "", pickup: "" });
  const [textOptIn, setTextOptIn] = useState(false);
  const [waiver, setWaiver] = useState(false);
  const [photo, setPhoto] = useState("Yes, artwork and photos");
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ id: string; total: number } | null>(null);
  const [pending, start] = useTransition();

  const sibling = Math.round(p.priceCents * (1 - p.siblingPct / 100));
  const total = p.priceCents + Math.max(0, campers.length - 1) * sibling;

  const setCamper = (i: number, k: keyof Camper, v: string) =>
    setCampers((cs) => cs.map((c, j) => (j === i ? { ...c, [k]: v } : c)));

  function validate(): string {
    if (step === 0 && campers.some((c) => !c.first.trim() || !c.last.trim() || !c.age.trim())) return "Please fill in each camper's name and age.";
    if (step === 1) {
      if (!parent.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parent.email.trim())) return "Please add a parent name and a valid email.";
      if (!parent.emName.trim() || !parent.emPhone.trim()) return "Please add an emergency contact.";
    }
    if (step === 2 && !waiver) return "Please agree to the waiver to continue.";
    return "";
  }

  function next() {
    const e = validate();
    setError(e);
    if (e) return;
    if (step < 3) return setStep(step + 1);
    const input: RegistrationInput = {
      campId: p.campId,
      campers,
      parentName: parent.name,
      parentEmail: parent.email,
      parentPhone: parent.phone,
      emergencyName: parent.emName,
      emergencyPhone: parent.emPhone,
      pickup: parent.pickup,
      textOptIn,
      waiverSigned: waiver,
      photoConsent: photo,
    };
    start(async () => {
      const r = await completeRegistration(input);
      if (r.ok) setDone({ id: r.id, total: r.totalCents });
      else setError(r.error);
    });
  }

  return (
    <div className="layout">
      <main>
        {!done && (
          <ol className="steps" aria-label="Registration steps">
            {labels.map((l, i) => (
              <li key={l} aria-current={i === step ? "step" : undefined}>
                <span className={`dot${i < step ? " done" : ""}`}>{i < step ? "✓" : i + 1}</span>
                {l}
              </li>
            ))}
          </ol>
        )}

        <section className="panel">
          {done ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start", padding: "24px 0" }}>
              <img src="/images/logo.jpg" alt="" width={120} height={120} style={{ mixBlendMode: "multiply" }} />
              <h1 style={{ fontSize: 40 }}>You're registered!</h1>
              <p className="muted" style={{ maxWidth: 480 }}>
                Demo confirmation #{done.id.toUpperCase()} for {money(done.total)}. No card was charged. In the live site, a confirmation and receipt would be emailed to {parent.email}.
              </p>
              <Link href="/camps" style={{ fontWeight: 600 }}>Browse more camps</Link>
            </div>
          ) : (
            <>
              {step === 0 && (
                <>
                  <div>
                    <h1>Who's coming to camp?</h1>
                    <p className="muted">Tell us about your camper so we can set up their spot.</p>
                  </div>
                  {campers.map((c, i) => (
                    <div className={campers.length > 1 ? "camper-block" : ""} key={i} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                      {campers.length > 1 && <strong>Camper {i + 1}</strong>}
                      <div className="fields">
                        <div className="field"><label htmlFor={`cf${i}`}>Camper first name</label><input id={`cf${i}`} value={c.first} onChange={(e) => setCamper(i, "first", e.target.value)} /></div>
                        <div className="field"><label htmlFor={`cl${i}`}>Camper last name</label><input id={`cl${i}`} value={c.last} onChange={(e) => setCamper(i, "last", e.target.value)} /></div>
                        <div className="field"><label htmlFor={`ca${i}`}>Age</label><input id={`ca${i}`} type="number" min={3} max={18} value={c.age} onChange={(e) => setCamper(i, "age", e.target.value)} /></div>
                      </div>
                      <div className="field"><label htmlFor={`cm${i}`}>Allergies, medical or learning needs</label><textarea id={`cm${i}`} rows={3} value={c.notes} onChange={(e) => setCamper(i, "notes", e.target.value)} /></div>
                      {campers.length > 1 && i > 0 && (
                        <div><button type="button" className="btn outline small" onClick={() => setCampers((cs) => cs.filter((_, j) => j !== i))}>Remove camper</button></div>
                      )}
                    </div>
                  ))}
                  {campers.length < p.spotsLeft && (
                    <div>
                      <button type="button" className="btn outline small" style={{ borderStyle: "dashed", borderColor: "var(--clay)", color: "var(--clay)" }} onClick={() => setCampers((cs) => [...cs, blank()])}>
                        + Add a sibling ({p.siblingPct}% sibling discount)
                      </button>
                    </div>
                  )}
                </>
              )}

              {step === 1 && (
                <>
                  <div>
                    <h1>Parent &amp; pickup</h1>
                    <p className="muted">We'll send confirmations and camp reminders here.</p>
                  </div>
                  <div className="fields">
                    <div className="field"><label htmlFor="pn">Parent or guardian name</label><input id="pn" autoComplete="name" value={parent.name} onChange={(e) => setParent({ ...parent, name: e.target.value })} /></div>
                    <div className="field"><label htmlFor="pe">Email</label><input id="pe" type="email" autoComplete="email" value={parent.email} onChange={(e) => setParent({ ...parent, email: e.target.value })} /></div>
                    <div className="field"><label htmlFor="pp">Mobile phone</label><input id="pp" type="tel" autoComplete="tel" value={parent.phone} onChange={(e) => setParent({ ...parent, phone: e.target.value })} /></div>
                    <div className="field"><label htmlFor="en">Emergency contact name</label><input id="en" value={parent.emName} onChange={(e) => setParent({ ...parent, emName: e.target.value })} /></div>
                    <div className="field"><label htmlFor="ep">Emergency contact phone</label><input id="ep" type="tel" value={parent.emPhone} onChange={(e) => setParent({ ...parent, emPhone: e.target.value })} /></div>
                  </div>
                  <div className="field"><label htmlFor="pk">Who else may pick up your camper?</label><input id="pk" placeholder="Names, separated by commas" value={parent.pickup} onChange={(e) => setParent({ ...parent, pickup: e.target.value })} /></div>
                  <label className="check" style={{ fontSize: 15 }}>
                    <input type="checkbox" checked={textOptIn} onChange={(e) => setTextOptIn(e.target.checked)} />
                    <span>Text me camp reminders at this number. <span className="small">Message and data rates may apply. Reply STOP anytime.</span></span>
                  </label>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <h1>Waiver &amp; photos</h1>
                    <p className="muted">A quick read and two choices.</p>
                  </div>
                  <div className="waiver" tabIndex={0}>[Your participation and liability waiver text goes here. Sunbeam will supply the final wording.]</div>
                  <label className="check"><input type="checkbox" checked={waiver} onChange={(e) => setWaiver(e.target.checked)} /> I've read and agree to the camp waiver.</label>
                  <fieldset style={{ border: 0, margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    <legend className="label" style={{ marginBottom: 8 }}>May we share photos of your camper's artwork or activities?</legend>
                    {["Yes, artwork and photos", "Artwork only, no faces", "No photos please"].map((o) => (
                      <label className="check" key={o} style={{ alignItems: "center" }}>
                        <input type="radio" name="photo" checked={photo === o} onChange={() => setPhoto(o)} /> {o}
                      </label>
                    ))}
                  </fieldset>
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <h1>Review &amp; pay</h1>
                    <p className="muted">Check the details, then complete your registration.</p>
                  </div>
                  <div className="notice" style={{ background: "var(--cream)" }}>
                    <strong>Demo checkout</strong>
                    <p className="muted" style={{ fontSize: 15 }}>
                      This preview doesn't take real payments. On the live site, this step is a secure Stripe card form and Sunbeam never sees card numbers.
                    </p>
                  </div>
                  <ul className="muted" style={{ margin: 0, paddingLeft: 20 }}>
                    {campers.map((c, i) => <li key={i}>{c.first} {c.last}, age {c.age}</li>)}
                    <li>Parent: {parent.name} ({parent.email})</li>
                  </ul>
                </>
              )}

              {error && <p className="error" role="alert">{error}</p>}
              <div className="nav-row">
                <button type="button" className="btn outline" disabled={step === 0 || pending} onClick={() => { setError(""); setStep(step - 1); }}>Back</button>
                <button type="button" className="btn" disabled={pending} onClick={next}>
                  {step === 3 ? (pending ? "Registering…" : `Register · ${money(total)}`) : "Continue"}
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      <aside aria-label="Order summary">
        <img src={p.image} alt="" style={{ height: 160, width: "100%", objectFit: "cover", borderRadius: 8 }} />
        <div>
          <div className="eyebrow" style={{ fontSize: 13, letterSpacing: "0.1em" }}>Your camp</div>
          <h2 style={{ fontWeight: 600, fontSize: 24, marginTop: 4 }}>{p.campName}</h2>
          <p className="muted" style={{ fontSize: 15 }}>{p.campMeta}</p>
        </div>
        <div className="summary">
          <div><span>{campers.length === 1 ? "1 camper" : `${campers.length} campers`}</span><span>{money(p.priceCents)}</span></div>
          {campers.length > 1 && (
            <div style={{ color: "var(--sage)" }}><span>Sibling discount</span><span>−{money(p.priceCents * (campers.length - 1) - sibling * (campers.length - 1))}</span></div>
          )}
          <div className="total"><span>Total</span><span>{money(total)}</span></div>
        </div>
        <p className="small">Questions? <Link href="/contact">Contact Sunbeam</Link></p>
      </aside>
    </div>
  );
}
