"use client";
import { useState } from "react";
import { MessageCircle, Search, Settings, SquarePen, ShieldCheck, WifiOff, RefreshCw } from "lucide-react";

export default function Home(){
 const [query,setQuery]=useState("");
 const [checking,setChecking]=useState(false);
 const [status,setStatus]=useState("Messaging is not connected");
 const [settings,setSettings]=useState(false);
 async function check(){
  const api=process.env.NEXT_PUBLIC_ZERO_API_URL;
  if(!api){setStatus("Messaging service is not configured");return;}
  setChecking(true);
  try{
   const controller=new AbortController();
   const timer=setTimeout(()=>controller.abort(),6000);
   try{
    const response=await fetch(new URL("/health",api).toString(),{signal:controller.signal,cache:"no-store"});
    setStatus(response.ok?"Server reachable. Secure sign-in and messaging are not connected.":"Messaging service unavailable");
   }finally{clearTimeout(timer);}
  }catch{setStatus("Messaging service unavailable");}
  finally{setChecking(false);}
 }
 return <main className="messenger">
  <aside className="chat-sidebar">
   <header className="sidebar-header"><img src="/zero-mark.svg" alt="ZERO"/><strong>ZERO</strong><button type="button" title="Settings" aria-label="Settings" onClick={()=>setSettings(v=>!v)}><Settings size={20}/></button></header>
   <div className="sidebar-title"><h1>Chats</h1><button type="button" aria-label="Start new chat" title="Start new chat" onClick={()=>setStatus("Sign-in and messaging must be connected before starting a chat")}><SquarePen size={20}/></button></div>
   <label className="chat-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search chats" aria-label="Search chats"/></label>
   {settings?<section className="sidebar-settings"><h2>Settings</h2><p>Account settings will be available after secure sign-in is connected.</p><button type="button" onClick={()=>setSettings(false)}>Back to chats</button></section>:<div className="sidebar-empty"><MessageCircle size={27}/><p>{query?"No matching conversations":"No conversations yet"}</p><small>{query?"Try another search.":"Your chats will appear here after you sign in."}</small></div>}
   <footer className="sidebar-status"><span className="status-dot"/> {status}</footer>
  </aside>
  <section className="chat-main"><div className="chat-top"><span><ShieldCheck size={17}/> Private messaging</span><span>ZERO</span></div>
   <div className="chat-welcome"><div className="welcome-icon"><MessageCircle size={32}/></div><h2>Welcome to ZERO</h2><p>A simple, private place for conversations. Your messages will appear here once your account and secure messaging service are connected.</p><div className="connection-note"><WifiOff size={17}/><span>{status}</span></div><button type="button" onClick={check} disabled={checking}><RefreshCw size={16}/>{checking?"Checking...":"Check connection"}</button><small>A server health check does not verify encrypted messaging.</small></div>
  </section>
 </main>;
}
