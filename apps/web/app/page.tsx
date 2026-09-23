"use client";

import { useState } from "react";

type Mode = "signin" | "signup";
type AuthMethod = "email" | "phone" | "passkey";

const cards = [
  ["E2EE", "Your conversations are encrypted end-to-end."],
  ["Temporary", "Set messages to disappear automatically."],
  ["PIN identity", "Connect without exposing a public username."],
  ["Private files", "Encrypt files before they leave your device."],
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
  const [status, setStatus] = useState(
    "Choose an authentication method, then continue."
  );
  const [logs, setLogs] = useState<string[]>([
    "ZERO web client loaded.",
    "Authentication provider boundary ready.",
  ]);

  function addLog(message: string) {
    const entry = `[${timestamp()}] ${message}`;
    setLogs((current) => [...current.slice(-5), entry]);
    if (typeof window !== "undefined") {
      console.info("[ZERO]", message);
    }
  }

  function selectMode(nextMode: Mode) {
    setMode(nextMode);
    setStatus(
      nextMode === "signup"
        ? "Create your private identity."
        : "Sign in to your ZERO identity."
    );
    addLog(`Mode selected: ${nextMode === "signup" ? "Sign up" : "Sign in"}.`);
  }

  function selectMethod(nextMethod: AuthMethod) {
    setMethod(nextMethod);
    setStatus(
      nextMethod === "passkey"
        ? "Passkey selected. Continue to start the passkey flow."
        : `Enter your ${nextMethod === "email" ? "email address" : "phone number"} to continue.`
    );
    addLog(`Authentication method selected: ${nextMethod}.`);
  }

  function handleContinue() {
    if (method !== "passkey" && !identifier.trim()) {
      setStatus(
        `Enter your ${method === "email" ? "email address" : "phone number"} before continuing.`
      );
      addLog("Continue blocked: required identifier is empty.");
      return;
    }

    if (method === "email" && !/^\S+@\S+\.\S+$/.test(identifier.trim())) {
      setStatus("Enter a valid email address.");
      addLog("Continue blocked: invalid email format.");
      return;
    }

    if (method === "phone" && !/^[+0-9][0-9\s().-]{6,}$/.test(identifier.trim())) {
      setStatus("Enter a valid phone number.");
      addLog("Continue blocked: invalid phone format.");
      return;
    }

    if (method === "passkey") {
      setStatus(
        `${mode === "signup" ? "Sign-up" : "Sign-in"} passkey request is ready, but the WebAuthn provider is not connected yet.`
      );
      addLog(
        `${mode === "signup" ? "Sign-up" : "Sign-in"} Continue accepted: passkey provider boundary reached.`
      );
      return;
    }

    setStatus(
      `${mode === "signup" ? "Sign-up" : "Sign-in"} request is ready for the ${method} OTP provider. The provider is not connected yet.`
    );
    addLog(
      `${mode === "signup" ? "Sign-up" : "Sign-in"} Continue accepted: ${method} OTP provider boundary reached.`
    );
  }

  return (
    <main>
      <section className="shell">
        <div className="brand">ZERO</div>
        <p className="eyebrow">PIN. PRIVATE. TEMPORARY. GONE.</p>
        <h1>Private communication without the baggage.</h1>
        <p className="lead">
          A privacy-first workspace for encrypted conversations, temporary
          sharing and device-controlled identity.
        </p>

        <div className="actions" aria-label="Authentication mode">
          <button
            type="button"
            onClick={() => selectMode("signup")}
            aria-pressed={mode === "signup"}
          >
            Create ZERO
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => selectMode("signin")}
            aria-pressed={mode === "signin"}
          >
            Sign in
          </button>
        </div>

        <div className="panel" aria-live="polite">
          <h2>{mode === "signup" ? "Create your private identity" : "Sign in securely"}</h2>
          <p id="auth-status" role="status">{status}</p>

          <form onSubmit={(event) => { event.preventDefault(); handleContinue(); }}>
            <div className="methods" role="group" aria-label="Authentication method">
            {(["email", "phone", "passkey"] as AuthMethod[]).map((item) => (
              <button
                type="button"
                key={item}
                className={method === item ? "method active" : "method"}
                onClick={() => selectMethod(item)}
                aria-pressed={method === item}
              >
                {item === "email"
                  ? "Email OTP"
                  : item === "phone"
                    ? "Phone OTP"
                    : "Passkey"}
              </button>
            ))}
            </div>

            {method !== "passkey" && (
            <label className="field">
              <span>{method === "email" ? "Email address" : "Phone number"}</span>
              <input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                type={method === "email" ? "email" : "tel"}
                autoComplete={method === "email" ? "email" : "tel"}
                placeholder={method === "email" ? "you@example.com" : "+234 800 000 0000"}
              />
            </label>
          )}

            <button type="submit" className="primary">
              Continue
            </button>
          </form>

          <section className="activity" aria-label="ZERO activity log">
            <div className="activity-header">
              <strong>Activity</strong>
              <span>Privacy-safe client events</span>
            </div>
            <ul>
              {logs.map((entry, index) => (
                <li key={`${entry}-${index}`}>{entry}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="grid">
          {cards.map(([title, copy]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
