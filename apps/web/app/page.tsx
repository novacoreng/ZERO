"use client";

import { FormEvent, useMemo, useState } from "react";

type Chat = { id:string; name:string; pin:string; preview:string; time:string; unread:number; online:boolean; kind:"direct"|"group" };
type Message = { id:string; chatId:string; text:string; time:string; mine:boolean; ttl:string; state:"sent"|"read" };

const seedChats:Chat[]=[
{id:"nova",name:"Nova Team",pin:"7Q2M-K9PX",preview:"The Windows test build is next.",time:"23:41",unread:2,online:true,kind:"group"},
{id:"tola",name:"Tola",pin:"4M8R-Q2AZ",preview:"Send it as a Data Drop.",time:"22:18",unread:0,online:true,kind:"direct"},
{id:"ops",name:"ZERO Security",pin:"9X3K-T7VN",preview:"New device verified.",time:"Mon",unread:1,online:false,kind:"group"},
{id:"ade",name:"Ade",pin:"2H6P-W8CY",preview:"Perfect. It disappeared.",time:"Sun",unread:0,online:false,kind:"direct"}
];
const seedMessages:Message[]=[
{id:"m1",chatId:"nova",text:"ZERO test workspace is online.",time:"23:32",mine:false,ttl:"24h",state:"read"},
{id:"m2",chatId:"nova",text:"I am testing the same conversation flow on web and Expo Go.",time:"23:35",mine:true,ttl:"24h",state:"read"},
{id:"m3",chatId:"nova",text:"The Windows test build is next.",time:"23:41",mine:false,ttl:"1h",state:"read"},
{id:"m4",chatId:"tola",text:"Send it as a Data Drop.",time:"22:18",mine:false,ttl:"24h",state:"read"},
{id:"m5",chatId:"ops",text:"New device verified.",time:"Mon",mine:false,ttl:"7d",state:"read"}
];

export default function Home(){
 const [chats,setChats]=useState(seedChats);
 const [messages,setMessages]=useState(seedMessages);
 const [activeId,setActiveId]=useState("nova");
 const [draft,setDraft]=useState("");
 const [query,setQuery]=useState("");
 const [ttl,setTtl]=useState("24h");
 const [notice,setNotice]=useState("TEST MODE · local conversation data");
 const [mobileList,setMobileList]=useState(true);
 const active=chats.find(c=>c.id===activeId)??chats[0];
 const visible=useMemo(()=>chats.filter(c=>(c.name+" "+c.pin+" "+c.preview).toLowerCase().includes(query.toLowerCase())),[chats,query]);
 const thread=messages.filter(m=>m.chatId===activeId);
 function selectChat(id:string){setActiveId(id);setMobileList(false);setChats(list=>list.map(c=>c.id===id?{...c,unread:0}:c));}
 function send(e:FormEvent){e.preventDefault();const text=draft.trim();if(!text)return;const now=new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit"}).format(new Date());setMessages(list=>[...list,{id:crypto.randomUUID(),chatId:activeId,text,time:now,mine:true,ttl,state:"sent"}]);setChats(list=>list.map(c=>c.id===activeId?{...c,preview:text,time:now}:c));setDraft("");setNotice("Message queued in local test mode. Network E2EE transport is not connected.");}
 function action(label:string){setNotice(label+" test boundary reached.");}
 return <main className="zero-shell">
  <aside className={mobileList?"rail mobile-show":"rail"}>
   <div className="brand"><img src="/zero-mark.svg" alt=""/><div><strong>ZERO</strong><small>PRIVATE · TEMPORARY</small></div><button onClick={()=>action("New chat")} aria-label="New chat">＋</button></div>
   <label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search chats, PINs, files"/></label>
   <div className="filters"><button className="active">All</button><button onClick={()=>action("Unread filter")}>Unread</button><button onClick={()=>action("Groups filter")}>Groups</button></div>
   <div className="chat-list">{visible.map(chat=><button key={chat.id} className={activeId===chat.id?"chat-row active":"chat-row"} onClick={()=>selectChat(chat.id)}>
    <span className="avatar">{chat.name.slice(0,2).toUpperCase()}<i className={chat.online?"online":""}/></span>
    <span className="chat-copy"><span><strong>{chat.name}</strong><time>{chat.time}</time></span><span><small>{chat.preview}</small>{chat.unread?<b>{chat.unread}</b>:null}</span></span>
   </button>)}</div>
   <div className="rail-foot"><button onClick={()=>action("Data Drops")}>◇ Data Drops</button><button onClick={()=>action("Settings")}>⚙ Settings</button></div>
  </aside>

  <section className={mobileList?"conversation mobile-hide":"conversation"}>
   <header className="conversation-head">
    <button className="back" onClick={()=>setMobileList(true)} aria-label="Back to chats">‹</button>
    <span className="avatar large">{active.name.slice(0,2).toUpperCase()}<i className={active.online?"online":""}/></span>
    <div className="person"><strong>{active.name}</strong><small>{active.online?"online now":active.pin+" · private"}</small></div>
    <div className="head-actions"><button onClick={()=>action("Encrypted voice call")} aria-label="Voice call">⌕</button><button onClick={()=>action("Encrypted video call")} aria-label="Video call">▻</button><button onClick={()=>action("Conversation details")} aria-label="Conversation details">•••</button></div>
   </header>
   <div className="security-strip"><span>✦ End-to-end encryption boundary</span><span>Messages expire by policy</span></div>
   <div className="thread">
    <div className="day">TODAY</div>
    {thread.map(m=><article key={m.id} className={m.mine?"bubble mine":"bubble"}>
      <p>{m.text}</p><footer><span>⌛ {m.ttl}</span><time>{m.time}</time>{m.mine?<span>{m.state==="read"?"✓✓":"✓"}</span>:null}</footer>
    </article>)}
   </div>
   <form className="composer" onSubmit={send}>
    <button type="button" onClick={()=>action("Attachment picker")} aria-label="Attach file">＋</button>
    <input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Message privately" aria-label="Message"/>
    <select value={ttl} onChange={e=>setTtl(e.target.value)} aria-label="Message expiry"><option>10s</option><option>1h</option><option>24h</option><option>7d</option></select>
    <button className="send" aria-label="Send message">↑</button>
   </form>
  </section>

  <aside className="details">
   <div className="profile-orb">{active.name.slice(0,2).toUpperCase()}</div><h2>{active.name}</h2><p>{active.pin}</p>
   <div className="detail-actions"><button onClick={()=>action("Search in conversation")}>⌕<span>Search</span></button><button onClick={()=>action("Mute")}>◌<span>Mute</span></button><button onClick={()=>action("Secure Share")}>◇<span>Drop</span></button></div>
   <section><small>PRIVACY</small><div><span>Message expiry</span><strong>{ttl}</strong></div><div><span>Forwarding</span><strong>Off</strong></div><div><span>Read receipts</span><strong>On</strong></div></section>
   <section><small>SHARED</small><button onClick={()=>action("Shared media")}>▧ Media and files <span>12</span></button><button onClick={()=>action("Secure links")}>⌁ Secure links <span>4</span></button></section>
   <button className="danger" onClick={()=>action("Cryptographic Shred")}>✦ Cryptographic Shred</button>
  </aside>

  <div className="test-notice" role="status"><i/>{notice}</div>
 </main>
}
