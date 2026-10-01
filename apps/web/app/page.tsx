"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Mode = "signin" | "signup";
type AuthMethod = "email" | "phone" | "passkey";
type Notice = { title: string; message: string } | null;

const methods: AuthMethod[] = ["email", "phone", "passkey"];
const primaryNav = [
  ["Home", "⌂"],
  ["Messages", "◌"],
  ["New message", "+"],
  ["Data Drops", "◇"],
  ["Files", "▱"],
  ["Devices", "⌁"],
];
const privacyNav = [["Security", "✦"], ["Activity", "◎"]];
const generalNav = [["Settings", "⚙"], ["Lock ZERO", "↪"]];

function timestamp() {
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("signup");
  const [method, setMethod] = useState<AuthMethod>("email");
  const [identifier, setIdentifier] = useState("");
  const [status, setStatus] = useState("Choose how you want to enter ZERO.");
  const [notice, setNotice] = useState<Notice>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const [logs, setLogs] = useState<string[]>(["ZERO client initialized.", "Private authentication boundary ready."]);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
  }, []);

  function addLog(message: string) {
    setLogs((current) => [...current.slice(-5), `[${timestamp()}] ${message}`]);
    console.info("[ZERO]", message);
  }

  function notify(title: string, message: string) {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    setNotice({ title, message });
    noticeTimer.current = setTimeout(() => setNotice(null), 3400);
  }

  function chooseNav(label: string) {
    setActive(label);
    setMobileOpen(false);
    addLog(`Navigation selected: ${label}.`);
    if (label !== "Home") notify(label, "This module is ready for its connected application flow.");
  }

  function selectMode(next: Mode) {
    setMode(next);
    setStatus(next === "signup" ? "Create a private ZERO identity." : "Continue to your ZERO identity.");
  }

  function selectMethod(next: AuthMethod) {
    setMethod(next);
    setStatus(next === "passkey" ? "Passkey selected. Continue to the secure provider boundary." : `Enter your ${next === "email" ? "email address" : "phone number"} to continue.`);
  }

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (method !== "passkey" && !identifier.trim()) {
      const label = method === "email" ? "email address" : "phone number";
      setStatus(`Enter your ${label} before continuing.`);
      notify("One more detail", `Enter your ${label} to continue.`);
      return;
    }
    if (method === "email" && !/^\S+@\S+\.\S+$/.test(identifier.trim())) {
      setStatus("Enter a valid email address.");
      notify("Check your email", "That address does not look valid yet.");
      return;
    }
    if (method === "phone" && !/^[+0-9][0-9\s().-]{6,}$/.test(identifier.trim())) {
      setStatus("Enter a valid phone number.");
      notify("Check your number", "Enter a valid phone number.");
      return;
    }
    const action = mode === "signup" ? "Sign-up" : "Sign-in";
    const channel = method === "passkey" ? "Passkey" : `${method.toUpperCase()} OTP`;
    setStatus(`${action} test request accepted. ${channel} provider boundary reached.`);
    notify(`${action} ready`, `${channel} provider boundary reached.`);
    addLog(`${action} accepted: ${channel} boundary reached.`);
  }

  function NavGroup({ title, items }: { title: string; items: string[][] }) {
    return (
      <div className="nav-group">
        <span className="nav-label">{title}</span>
        {items.map(([label, icon]) => (
          <button key={label} type="button" className={active === label ? "side-link active" : "side-link"} aria-current={active === label ? "page" : undefined} onClick={() => chooseNav(label)} title={collapsed ? label : undefined}>
            <span className="side-icon" aria-hidden="true">{icon}</span>
            <span className="side-text">{label}</span>
            {label === "Messages" ? <span className="badge">3</span> : null}
          </button>
        ))}
      </div>
    );
  }

  return (
    <main className={collapsed ? "app collapsed" : "app"}>
      {notice ? (
        <div className="dynamic-island" role="status" aria-live="polite">
          <span className="island-mark"><img src="/zero-mark.svg" alt="" /></span>
          <span className="island-copy"><strong>{notice.title}</strong><small>{notice.message}</small></span>
          <button type="button" className="island-close" aria-label="Dismiss notification" onClick={() => setNotice(null)}>×</button>
        </div>
      ) : null}

      <button type="button" className="mobile-menu" aria-label="Open navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>☰</button>
      {mobileOpen ? <button type="button" className="scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} /> : null}

      <aside className={mobileOpen ? "sidebar mobile-open" : "sidebar"} aria-label="ZERO navigation">
        <div className="traffic" aria-hidden="true"><i /><i /><i /></div>
        <div className="sidebar-head">
          <a href="/" className="side-brand" aria-label="ZERO home"><img src="/zero-mark.svg" alt="" /><span>ZERO</span></a>
          <button type="button" className="collapse-button" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={() => setCollapsed((value) => !value)}>{collapsed ? "›" : "‹"}</button>
        </div>

        <div className="identity">
          <div className="avatar"><img src="/zero-mark.svg" alt="" /></div>
          <div className="identity-copy"><strong>Private identity</strong><span>PIN · TEMPORARY</span></div>
          <span className="chevron" aria-hidden="true">›</span>
        </div>

        <div className="search-wrap"><span aria-hidden="true">⌕</span><input aria-label="Search ZERO" placeholder="SEARCH…" /></div>

        <nav className="sidebar-scroll">
          <NavGroup title="MENU" items={primaryNav} />
          <NavGroup title="PRIVACY" items={privacyNav} />
          <NavGroup title="GENERAL" items={generalNav} />
        </nav>
      </aside>

      <section className="content-shell">
        <header className="content-topbar">
          <div><span className="eyebrow">ZERO / {active.toUpperCase()}</span><h1>{active === "Home" ? "Private communication." : active}</h1></div>
          <span className="test-pill"><i /> TEST BUILD</span>
        </header>

        <section className="welcome-grid">
          <article className="statement-card">
            <span className="eyebrow">PIN · PRIVATE · TEMPORARY · GONE</span>
            <h2>Say what matters.<br /><em>Keep only what should stay.</em></h2>
            <p>ZERO is designed around private identity, encrypted communication and explicit message lifecycles.</p>
            <div className="statement-mark"><img src="/zero-mark.svg" alt="" /></div>
          </article>

          <section className="auth-card" aria-labelledby="auth-title">
            <div className="auth-meta"><span>IDENTITY</span><span className="ready"><i /> READY</span></div>
            <h2 id="auth-title">{mode === "signup" ? "Create your ZERO" : "Welcome back"}</h2>
            <p className="auth-intro">{status}</p>

            <div className="mode-switch" role="tablist" aria-label="Authentication mode">
              <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "active" : ""} onClick={() => selectMode("signup")}>Create account</button>
              <button type="button" role="tab" aria-selected={mode === "signin"} className={mode === "signin" ? "active" : ""} onClick={() => selectMode("signin")}>Sign in</button>
            </div>

            <form onSubmit={handleContinue}>
              <div className="method-list" role="radiogroup" aria-label="Authentication method">
                {methods.map((item) => (
                  <button key={item} type="button" role="radio" aria-checked={method === item} className={method === item ? "method active" : "method"} onClick={() => selectMethod(item)}>
                    <span>{item === "email" ? "@" : item === "phone" ? "⌁" : "◇"}</span>
                    <strong>{item === "email" ? "Email" : item === "phone" ? "Phone" : "Passkey"}</strong>
                  </button>
                ))}
              </div>
              {method !== "passkey" ? (
                <label className="field"><span>{method === "email" ? "Email address" : "Phone number"}</span><input value={identifier} onChange={(event) => setIdentifier(event.target.value)} type={method === "email" ? "email" : "tel"} autoComplete={method === "email" ? "email" : "tel"} placeholder={method === "email" ? "you@example.com" : "+234 800 000 0000"} /></label>
              ) : null}
              <button type="submit" className="primary">Continue <span aria-hidden="true">→</span></button>
            </form>
            <p className="sr-only" role="status">{status}</p>
          </section>
        </section>

        <section className="quick-grid" aria-label="ZERO quick actions">
          <button type="button" onClick={() => chooseNav("New message")}><span>+</span><strong>New message</strong><small>Start privately</small></button>
          <button type="button" onClick={() => chooseNav("Data Drops")}><span>◇</span><strong>Data Drop</strong><small>Share temporarily</small></button>
          <button type="button" onClick={() => chooseNav("Devices")}><span>⌁</span><strong>Devices</strong><small>Review trust</small></button>
        </section>

        <section className="activity-card" aria-label="Privacy-safe activity log">
          <div><span className="eyebrow">ACTIVITY</span><strong>Local diagnostic trail</strong></div>
          <ul>{logs.map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}</ul>
        </section>
      </section>
    </main>
  );
}
