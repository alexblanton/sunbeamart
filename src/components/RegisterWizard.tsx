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
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
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

  const back = () => {
    setError("");
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="layout">
      <main>
        {!done && (
          <>
            <ol className="steps" aria-label="Registration steps">
              {labels.map((l, i) => (
                <li key={l} aria-current={i === step ? "step" : undefined}>
                  <span className={`dot${i < step ? " done" : ""}`}>{i < step ? "✓" : i + 1}</span>
                  {l}
                </li>
              ))}
            </ol>
            <div className="steps-compact" aria-hidden="true">
              <div className="label-row"><strong>{labels[step]}</strong><span>Step {step + 1} of {labels.length}</span></div>
              <div className="progress">{labels.map((l, i) => <span key={l} className={i <= step ? "on" : ""} />)}</div>
            </div>
          </>
        )}

        <section className="panel">
          {done ? (
            <div className="done-state">
              <img src="/images/logo.jpg" alt="" width={120} height={120} style={{ mixBlendMode: "multiply" }} />
              <h1>You're registered!</h1>
              <p className="muted" style={{ maxWidth: 480 }}>
                Demo confirmation #{done.id.toUpperCase()} for {money(done.total)}. No card was charged. In the live site, a confirmation and receipt would be emailed to {parent.email}.
              </p>
              <Link href="/camps" className="btn outline block-sm">Browse more camps</Link>
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
                    <div className={campers.length > 1 ? "camper-block" : "plain-fields"} key={i}>
                      {campers.length > 1 && (
                        <div className="camper-head">
                          <strong>Camper {i + 1}</strong>
                          {i > 0 && (
                            <button type="button" className="btn outline small" onClick={() => setCampers((cs) => cs.filter((_, j) => j !== i))}>Remove</button>
                          )}
                        </div>
                      )}
                      <div className="fields">
                        <div className="field"><label htmlFor={`cf${i}`}>Camper first name</label><input id={`cf${i}`} autoComplete="off" autoCapitalize="words" value={c.first} onChange={(e) => setCamper(i, "first", e.target.value)} /></div>
                        <div className="field"><label htmlFor={`cl${i}`}>Camper last name</label><input id={`cl${i}`} autoComplete="off" autoCapitalize="words" value={c.last} onChange={(e) => setCamper(i, "last", e.target.value)} /></div>
                        <div className="field"><label htmlFor={`ca${i}`}>Age</label><input id={`ca${i}`} type="number" inputMode="numeric" min={3} max={18} value={c.age} onChange={(e) => setCamper(i, "age", e.target.value)} /></div>
                      </div>
                      <div className="field"><label htmlFor={`cm${i}`}>Allergies, medical or learning needs</label><textarea id={`cm${i}`} rows={3} value={c.notes} onChange={(e) => setCamper(i, "notes", e.target.value)} /></div>
                    </div>
                  ))}
                  {campers.length < p.spotsLeft && (
                    <button type="button" className="btn dashed small block-sm" onClick={() => setCampers((cs) => [...cs, blank()])}>
                      + Add a sibling ({p.siblingPct}% off)
                    </button>
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
                    <div className="field"><label htmlFor="pn">Parent or guardian name</label><input id="pn" autoComplete="name" autoCapitalize="words" value={parent.name} onChange={(e) => setParent({ ...parent, name: e.target.value })} /></div>
                    <div className="field"><label htmlFor="pe">Email</label><input id="pe" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} value={parent.email} onChange={(e) => setParent({ ...parent, email: e.target.value })} /></div>
                    <div className="field"><label htmlFor="pp">Mobile phone</label><input id="pp" type="tel" inputMode="tel" autoComplete="tel" value={parent.phone} onChange={(e) => setParent({ ...parent, phone: e.target.value })} /></div>
                    <div className="field"><label htmlFor="en">Emergency contact name</label><input id="en" autoComplete="off" autoCapitalize="words" value={parent.emName} onChange={(e) => setParent({ ...parent, emName: e.target.value })} /></div>
                    <div className="field"><label htmlFor="ep">Emergency contact phone</label><input id="ep" type="tel" inputMode="tel" autoComplete="off" value={parent.emPhone} onChange={(e) => setParent({ ...parent, emPhone: e.target.value })} /></div>
                    <div className="field"><label htmlFor="pk">Who else may pick up?</label><input id="pk" placeholder="Names, separated by commas" value={parent.pickup} onChange={(e) => setParent({ ...parent, pickup: e.target.value })} /></div>
                  </div>
                  <label className="check boxed" style={{ fontSize: 15, alignItems: "flex-start" }}>
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
                  <label className="check boxed"><input type="checkbox" checked={waiver} onChange={(e) => setWaiver(e.target.checked)} /> I've read and agree to the camp waiver.</label>
                  <fieldset className="choices">
                    <legend className="label">May we share photos of your camper's artwork or activities?</legend>
                    {["Yes, artwork and photos", "Artwork only, no faces", "No photos please"].map((o) => (
                      <label className="check boxed" key={o}>
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
                  <ul className="review-list">
                    {campers.map((c, i) => (
                      <li key={i}><span className="k">Camper{campers.length > 1 ? ` ${i + 1}` : ""}</span>{c.first} {c.last}, age {c.age}</li>
                    ))}
                    <li><span className="k">Parent</span>{parent.name} ({parent.email})</li>
                    <li><span className="k">Total</span><strong>{money(total)}</strong></li>
                  </ul>
                  <div className="notice" style={{ background: "var(--cream)", padding: 16 }}>
                    <strong>Demo checkout</strong>
                    <p className="muted" style={{ fontSize: 15 }}>
                      This preview doesn't take real payments. On the live site, this step is a secure Stripe card form and Sunbeam never sees card numbers.
                    </p>
                  </div>
                </>
              )}

              {error && <p className="error" role="alert">{error}</p>}
              <div className="nav-row">
                {step > 0 && <button type="button" className="btn outline" disabled={pending} onClick={back}>Back</button>}
                <button type="button" className="btn" disabled={pending} onClick={next} style={step === 0 ? { marginLeft: "auto" } : undefined}>
                  {step === 3 ? (pending ? "Registering…" : `Register · ${money(total)}`) : "Continue"}
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      <aside aria-label="Order summary">
        <div className="camp-summary">
          <img src={p.image} alt="" />
          <div>
            <div className="eyebrow" style={{ fontSize: 12, letterSpacing: "0.1em" }}>Your camp</div>
            <h2>{p.campName}</h2>
            <p>{p.campMeta}</p>
          </div>
        </div>
        <div className="summary">
          <div><span>{campers.length === 1 ? "1 camper" : `${campers.length} campers`}</span><span>{money(p.priceCents * campers.length)}</span></div>
          {campers.length > 1 && (
            <div className="discount"><span>Sibling discount</span><span>−{money(p.priceCents * (campers.length - 1) - sibling * (campers.length - 1))}</span></div>
          )}
          <div className="total"><span>Total</span><span>{money(total)}</span></div>
        </div>
        <p className="small help">Questions? <Link href="/contact">Contact Sunbeam</Link></p>
      </aside>
    </div>
  );
}
