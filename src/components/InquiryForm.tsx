"use client";

import { useActionState } from "react";
import { submitContact, submitParty, type FormState } from "@/app/actions";

const initial: FormState = { ok: false };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);
  if (state.ok)
    return (
      <div className="notice" role="status">
        <h2>Thanks, your message is on its way.</h2>
        <p className="muted">We'll reply to the email you gave us.</p>
      </div>
    );
  return (
    <form className="form" action={action} aria-label="Contact Sunbeam Art House">
      <div className="field"><label htmlFor="cn">Name</label><input id="cn" name="name" autoComplete="name" required /></div>
      <div className="field"><label htmlFor="ce">Email</label><input id="ce" name="email" type="email" autoComplete="email" required /></div>
      <div className="field"><label htmlFor="cp">Phone (optional)</label><input id="cp" name="phone" type="tel" inputMode="tel" autoComplete="tel" /></div>
      <div className="field">
        <label htmlFor="ct">I'm asking about</label>
        <select id="ct" name="topic">
          <option>A camp or event</option>
          <option>An art party</option>
          <option>Working together</option>
          <option>Something else</option>
        </select>
      </div>
      <div className="field full"><label htmlFor="cm">Message</label><textarea id="cm" name="message" rows={6} required /></div>
      <div className="field full">
        {state.error && <p className="error" role="alert">{state.error}</p>}
        <div className="form-actions">
          <button className="btn block-sm" disabled={pending}>{pending ? "Sending…" : "Send message"}</button>
          <p className="small">We never share your details.</p>
        </div>
      </div>
    </form>
  );
}

export function PartyForm() {
  const [state, action, pending] = useActionState(submitParty, initial);
  if (state.ok)
    return (
      <div className="notice" role="status">
        <h3>Thanks! We'll be in touch with party ideas soon.</h3>
        <p className="muted">Watch your inbox for a plan and quote.</p>
      </div>
    );
  return (
    <form className="form" action={action} aria-label="Party request">
      <div className="field"><label htmlFor="pn">Your name</label><input id="pn" name="name" autoComplete="name" required /></div>
      <div className="field"><label htmlFor="pe">Email</label><input id="pe" name="email" type="email" autoComplete="email" required /></div>
      <div className="field">
        <label htmlFor="pt">Party type</label>
        <select id="pt" name="type">
          <option>Neighborhood Art Party</option>
          <option>Birthday party</option>
          <option>Other celebration</option>
        </select>
      </div>
      <div className="field"><label htmlFor="pd">Preferred date</label><input id="pd" name="date" type="date" /></div>
      <div className="field"><label htmlFor="pg">Number of guests</label><input id="pg" name="guests" type="number" inputMode="numeric" min={1} /></div>
      <div className="field"><label htmlFor="pa">Guest ages</label><input id="pa" name="ages" placeholder="e.g. 5 to 9, plus parents" /></div>
      <div className="field full"><label htmlFor="pm">Theme ideas or anything else</label><textarea id="pm" name="notes" rows={4} /></div>
      <div className="field full">
        {state.error && <p className="error" role="alert">{state.error}</p>}
        <div className="form-actions"><button className="btn block-sm" disabled={pending}>{pending ? "Sending…" : "Send request"}</button></div>
      </div>
    </form>
  );
}
