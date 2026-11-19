"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function Login() {
  const [state, action, pending] = useActionState(login, {} as { error?: string });
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form action={action} className="notice" style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 16 }}>
        <img src="/images/logo.jpg" alt="Sunbeam Art House" width={96} height={96} style={{ mixBlendMode: "multiply" }} />
        <h1 style={{ fontSize: 28 }}>Sunbeam admin</h1>
        <div className="field">
          <label htmlFor="pw">Password</label>
          <input id="pw" name="password" type="password" autoComplete="current-password" autoFocus required />
        </div>
        {state.error && <p className="error" role="alert">{state.error}</p>}
        <button className="btn" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
        <p className="small">Demo password: sunbeam-demo</p>
      </form>
    </div>
  );
}
