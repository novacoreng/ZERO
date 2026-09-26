"use client";

import { FormEvent, useState } from "react";

type Mode = "signin" | "signup";
type AuthMethod = "email" | "phone" | "passkey";

type Notice = { title: string; message: string } | null;

const features = [
  ["E2EE", "Private by design."],
  ["SHRED", "Messages have an explicit lifecycle."],
  ["FILES", "Encrypted document workflows are planned for the next integration boundary."],
  ["ALERTS", "Transient notification UX is ready for testing."],
];

const methods: AuthMethod[] = ["email", "phone", "passkey"];

function timestamp() {
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("signup");
  const [method, setMethod] = useState<AuthMethod>("email");
  const [identifier, setIdentifier] = useState("");
  const [status, setStatus] = useState("Choose an authentication method, then continue.");
  const [notice, setNotice] = useState<Notice>(null);
  const [logs, setLogs] = useState<string[]>(["ZERO client loaded.", "Authentication boundary ready."]);

  function addLog(message: string) {
    const entry = `[${timestamp()}] ${message}`;
    setLogs((current) => [...current.slice(-5), entry]);
    console.info("[ZERO]", message);
  }

  function notify(title: string, message: string) {
    setNotice({ title, message });
    window.setTimeout(() => setNotice(null), 3400);
  }

  function selectMode(next: Mode) {
    setMode(next);
    setStatus(next === "signup" ? "Create your private identity." : "Sign in to your ZERO identity.");
    addLog(`Mode selected: ${next}.`);
  }

  function selectMethod(next: AuthMethod) {
    setMethod(next);
    setStatus(next === "passkey" ? "Passkey selected. Continue to start the passkey boundary." : `Enter your ${next === "email" ? "email address" : "phone number"} to continue.`);
    addLog(`Authentication method selected: ${next}.`);
  }

  function handleContinue(event?: FormEvent) {
    event?.preventDefault();

    if (method !== "passkey" && !identifier.trim()) {
      const label = method === "email" ? "email address" : "phone number";
      setStatus(`Enter your ${label} before continuing.`);
      notify("ZERO needs one more thing", `Enter your ${label} to continue.`);
      addLog("Continue blocked: required identifier is empty.");
      return;
    }

    if (method === "email" && !/^\S+@\S+\.\S+$/.test(identifier.trim())) {
      setStatus("Enter a valid email address.");
      notify("Check your email", "That address does not look valid yet.");
      addLog("Continue blocked: invalid email format.");
      return;
    }

    if (method === "phone" && !/^[+0-9][0-9\s().-]{6,}$/.test(identifier.trim())) {
      setStatus("Enter a valid phone number.");
      notify("Check your number", "Enter a valid phone number.");
      addLog("Continue blocked: invalid phone format.");
      return;
    }

    const action = mode === "signup" ? "Sign-up" : "Sign-in";
    const channel = method === "passkey" ? "Passkey" : `${method.toUpperCase()} OTP`;
    setStatus(`${action} test request accepted. ${channel} provider boundary reached.`);
    notify(`${action} ready`, `${channel} test boundary reached.`);
    addLog(`${action} accepted: ${channel} boundary reached.`);
  }

  return (
    <main className="app-shell">
      {notice ? (
        <div className="island" role="status" aria-live="polite">
          <span className="island-orb" aria-hidden="true" />
          <span className="island-copy"><strong>{notice.title}</strong><small>{notice.message}</small></span>
          <button type="button" className="island-close" aria-label="Dismiss notification" onClick={() => setNotice(null)}>×</button>
        </div>
      ) : null}

      <header className="topbar">
        <div className="brand-lockup"><img src="/zero-mark.svg" alt="" /><span>ZERO</span></div>
        <span className="environment">TEST ENVIRONMENT</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">PIN · PRIVATE · TEMPORARY · GONE</p>
          <h1>Private communication without the baggage.</h1>
          <p className="lead">A clean, privacy-first testing surface for ZERO identity, disappearing messages and private sharing.</p>
        </div>
        <div className="hero-mark" aria-hidden="true"><img src="/zero-mark.svg" alt="" /></div>
      </section>

      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-head">
          <div><p className="eyebrow">IDENTITY</p><h2 id="auth-title">{mode === "signup" ? "Create your private identity" : "Sign in securely"}</h2></div>
          <span className="status-dot">READY</span>
        </div>

        <div className="segmented" role="tablist" aria-label="Authentication mode">
          <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "selected" : ""} onClick={() => selectMode("signup")}>Create ZERO</button>
          <button type="button" role="tab" aria-selected={mode === "signin"} className={mode === "signin" ? "selected" : ""} onClick={() => selectMode("signin")}>Sign in</button>
        </div>

        <p id="auth-status" className="status-copy" role="status">{status}</p>

        <form onSubmit={handleContinue}>
          <div className="methods" role="radiogroup" aria-label="Authentication method">
            {methods.map((item) => (
              <button key={item} type="button" role="radio" aria-checked={method === item} className={method === item ? "method active" : "method"} onClick={() => selectMethod(item)}>
                {item === "email" ? "Email OTP" : item === "phone" ? "Phone OTP" : "Passkey"}
              </button>
            ))}
          </div>

          {method !== "passkey" ? (
            <label className="field"><span>{method === "email" ? "Email address" : "Phone number"}</span><input value={identifier} onChange={(event) => setIdentifier(event.target.value)} type={method === "email" ? "email" : "tel"} autoComplete={method === "email" ? "email" : "tel"} placeholder={method === "email" ? "you@example.com" : "+234 800 000 0000"} /></label>
          ) : null}

          <button type="submit" className="primary">Continue <span aria-hidden="true">→</span></button>
        </form>

        <section className="activity" aria-label="Privacy-safe activity log">
          <div className="activity-head"><strong>Activity</strong><span>Local diagnostic events only</span></div>
          <ul>{logs.map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}</ul>
        </section>
      </section>

      <section className="feature-grid" aria-label="ZERO capabilities">
        {features.map(([title, copy]) => <article key={title}><strong>{title}</strong><p>{copy}</p></article>)}
      </section>
    </main>
  );
}
