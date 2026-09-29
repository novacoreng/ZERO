"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Mode = "signin" | "signup";
type AuthMethod = "email" | "phone" | "passkey";
type Notice = { title: string; message: string } | null;

const methods: AuthMethod[] = ["email", "phone", "passkey"];

const principles = [
  ["01", "PRIVATE", "Identity stays minimal by default."],
  ["02", "TEMPORARY", "Messages are designed around explicit lifecycles."],
  ["03", "CONTROLLED", "Your device and session remain the source of intent."],
];

function timestamp() {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("signup");
  const [method, setMethod] = useState<AuthMethod>("email");
  const [identifier, setIdentifier] = useState("");
  const [status, setStatus] = useState("Choose how you want to enter ZERO.");
  const [notice, setNotice] = useState<Notice>(null);
  const [logs, setLogs] = useState<string[]>([
    "ZERO client initialized.",
    "Private authentication boundary ready.",
  ]);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
  }, []);

  function addLog(message: string) {
    const entry = `[${timestamp()}] ${message}`;
    setLogs((current) => [...current.slice(-5), entry]);
    console.info("[ZERO]", message);
  }

  function notify(title: string, message: string) {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    setNotice({ title, message });
    noticeTimer.current = setTimeout(() => setNotice(null), 3400);
  }

  function selectMode(next: Mode) {
    setMode(next);
    setStatus(next === "signup" ? "Create a private ZERO identity." : "Continue to your ZERO identity.");
    addLog(`Mode selected: ${next}.`);
  }

  function selectMethod(next: AuthMethod) {
    setMethod(next);
    setStatus(
      next === "passkey"
        ? "Passkey selected. Continue to start the secure provider boundary."
        : `Enter your ${next === "email" ? "email address" : "phone number"} to continue.`,
    );
    addLog(`Authentication method selected: ${next}.`);
  }

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (method !== "passkey" && !identifier.trim()) {
      const label = method === "email" ? "email address" : "phone number";
      setStatus(`Enter your ${label} before continuing.`);
      notify("One more detail", `Enter your ${label} to continue.`);
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
    notify(`${action} ready`, `${channel} provider boundary reached.`);
    addLog(`${action} accepted: ${channel} boundary reached.`);
  }

  return (
    <main className="zero-app">
      <div className="ambient ambient-a" aria-hidden="true" />
      <div className="ambient ambient-b" aria-hidden="true" />

      {notice ? (
        <div className="dynamic-island" role="status" aria-live="polite">
          <span className="island-pulse" aria-hidden="true" />
          <span className="island-copy">
            <strong>{notice.title}</strong>
            <small>{notice.message}</small>
          </span>
          <button type="button" className="island-close" aria-label="Dismiss notification" onClick={() => setNotice(null)}>×</button>
        </div>
      ) : null}

      <header className="nav">
        <a className="brand" href="/" aria-label="ZERO home">
          <img src="/zero-mark.svg" alt="" />
          <span>ZERO</span>
        </a>
        <div className="nav-meta">
          <span className="live-dot" aria-hidden="true" />
          <span>TEST BUILD</span>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="kicker"><span>01</span> PRIVATE COMMUNICATION</div>
          <h1 id="hero-title">Say less.<br /><em>Keep less.</em></h1>
          <p>ZERO is built for conversations that should not become permanent records.</p>
          <div className="hero-line" aria-hidden="true" />
        </div>
        <div className="hero-symbol" aria-hidden="true">
          <div className="symbol-ring ring-one" />
          <div className="symbol-ring ring-two" />
          <img src="/zero-mark.svg" alt="" />
          <span>DISAPPEAR</span>
        </div>
      </section>

      <section className="workspace" aria-labelledby="auth-title">
        <div className="workspace-label">
          <span>02 / IDENTITY</span>
          <span>ENCRYPTED BY DESIGN</span>
        </div>

        <div className="auth-layout">
          <aside className="side-note">
            <p className="side-index">ZERO / ENTRY</p>
            <h2>Your identity<br />doesn't need<br />to be public.</h2>
            <p>Choose a private authentication method. The provider connection remains explicit until configured.</p>
          </aside>

          <div className="auth-card">
            <div className="card-topline">
              <span className="card-kicker">{mode === "signup" ? "NEW IDENTITY" : "RETURNING IDENTITY"}</span>
              <span className="secure-state"><span /> READY</span>
            </div>
            <h2 id="auth-title">{mode === "signup" ? "Create your ZERO" : "Welcome back"}</h2>
            <p className="auth-intro">{status}</p>

            <div className="mode-switch" role="tablist" aria-label="Authentication mode">
              <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "active" : ""} onClick={() => selectMode("signup")}>Create account</button>
              <button type="button" role="tab" aria-selected={mode === "signin"} className={mode === "signin" ? "active" : ""} onClick={() => selectMode("signin")}>Sign in</button>
            </div>

            <form onSubmit={handleContinue}>
              <div className="method-list" role="radiogroup" aria-label="Authentication method">
                {methods.map((item) => (
                  <button key={item} type="button" role="radio" aria-checked={method === item} className={method === item ? "method-card active" : "method-card"} onClick={() => selectMethod(item)}>
                    <span className="method-icon" aria-hidden="true">{item === "email" ? "@" : item === "phone" ? "⌁" : "◈"}</span>
                    <span><strong>{item === "email" ? "Email" : item === "phone" ? "Phone" : "Passkey"}</strong><small>{item === "passkey" ? "Device credential" : "One-time code"}</small></span>
                    <span className="method-check" aria-hidden="true">{method === item ? "●" : "○"}</span>
                  </button>
                ))}
              </div>

              {method !== "passkey" ? (
                <label className="field">
                  <span>{method === "email" ? "Email address" : "Phone number"}</span>
                  <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} type={method === "email" ? "email" : "tel"} autoComplete={method === "email" ? "email" : "tel"} placeholder={method === "email" ? "you@example.com" : "+234 800 000 0000"} aria-describedby="auth-status" />
                </label>
              ) : null}

              <button type="submit" className="continue-button">Continue <span aria-hidden="true">↗</span></button>
            </form>

            <p id="auth-status" className="sr-status" role="status">{status}</p>
          </div>
        </div>
      </section>

      <section className="principles" aria-label="ZERO principles">
        {principles.map(([number, title, copy]) => (
          <article key={number}>
            <span>{number}</span>
            <div><strong>{title}</strong><p>{copy}</p></div>
          </article>
        ))}
      </section>

      <section className="activity-panel" aria-label="Privacy-safe activity log">
        <div><span className="panel-index">03 / ACTIVITY</span><strong>Local diagnostic trail</strong></div>
        <ul>{logs.map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}</ul>
      </section>

      <footer className="footer"><span>ZERO</span><span>PIN · PRIVATE · TEMPORARY · GONE</span></footer>
    </main>
  );
}
