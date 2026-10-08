"use client";
import { useState } from "react";
import { AlertCircle, ArrowRight, LockKeyhole, RefreshCw, ShieldCheck } from "lucide-react";

export default function Home() {
  const [checking,setChecking]=useState(false);
  const [status,setStatus]=useState<"unconfigured"|"unavailable">("unconfigured");
  const api=process.env.NEXT_PUBLIC_ZERO_API_URL;
  async function checkConnection(){
    if(!api){setStatus("unconfigured");return;}
    setChecking(true);
    try {
      const controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),6000);
      try {
        const response=await fetch(new URL("/health",api).toString(),{signal:controller.signal,cache:"no-store"});
        setStatus(response.ok?"unconfigured":"unavailable");
      } finally {clearTimeout(timeout);}
    } catch {setStatus("unavailable");}
    finally {setChecking(false);}
  }
  return <main className="zero-gate">
    <section className="zero-gate-card">
      <div className="zero-gate-brand"><img src="/zero-mark.svg" alt="ZERO logo"/><div><strong>ZERO</strong><small>PIN. PRIVATE. TEMPORARY. GONE.</small></div></div>
      <div className="zero-gate-icon"><LockKeyhole size={28}/></div>
      <p className="zero-gate-kicker"><ShieldCheck size={15}/> SECURE MESSAGING</p>
      <h1>Your privacy deserves a real connection.</h1>
      <p className="zero-gate-copy">ZERO messaging is not yet available on this deployment. We have removed simulated conversations, fabricated delivery indicators and local-only messages. Sign-in and messaging will open after the authenticated, encrypted service is connected and verified.</p>
      <div className="zero-gate-warning" role="status"><AlertCircle size={20}/><span>{status==="unavailable"?"The service could not be reached.":"Account and encrypted messaging services are not configured for verified use."}</span></div>
      <button type="button" className="zero-gate-check" disabled={checking} onClick={checkConnection}><RefreshCw size={17}/>{checking?"Checking connection...":"Check service connection"}<ArrowRight size={16}/></button>
      <p className="zero-gate-note">A health response alone does not prove that authentication or end-to-end encryption is operational.</p>
    </section>
  </main>;
}
