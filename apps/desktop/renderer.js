"use strict";
(async()=>{
 const pin=document.getElementById("pin");
 const title=document.getElementById("section-title");
 const viewTitle=document.getElementById("view-title");
 const welcomeTitle=document.getElementById("welcome-title");
 const welcomeText=document.getElementById("welcome-text");
 const navs=["chats","contacts","settings"];
 function show(view){
  navs.forEach(name=>document.getElementById("nav-"+name).classList.toggle("active",name===view));
  title.textContent=view==="chats"?"Chats":view==="contacts"?"Contacts":"Settings";
  viewTitle.textContent=title.textContent;
  welcomeTitle.textContent=view==="chats"?"Welcome to ZERO":view==="contacts"?"Your contacts":"Device settings";
  welcomeText.textContent=view==="chats"?"No signups. Your device creates its own PIN. Conversations will appear once secure messaging is implemented.":view==="contacts"?"Contacts will appear after PIN discovery and secure messaging are connected.":"Your device PIN and registration controls are in the sidebar.";
 }
 navs.forEach(name=>document.getElementById("nav-"+name).addEventListener("click",()=>show(name)));
 document.getElementById("nav-back").addEventListener("click",()=>show("chats"));
 document.getElementById("new-chat").addEventListener("click",()=>{show("contacts");document.getElementById("status").textContent="Starting a chat requires authenticated messaging, which is not available yet.";});
 document.getElementById("search").addEventListener("input",event=>{if(event.target.value.trim())document.getElementById("status").textContent="No connected conversations to search yet.";});

 const status=document.getElementById("status");
 const copy=document.getElementById("copy");
 const register=document.getElementById("register");
 const authenticate=document.getElementById("authenticate");
 const refresh=document.getElementById("refresh-inbox");
 const inbox=document.getElementById("inbox-list");
 async function refreshInbox(){
  refresh.disabled=true;
  try{
   const result=await window.ZERO_DESKTOP.getInbox();
   if(!result.connected){status.textContent=result.error||"Inbox unavailable";return;}
   inbox.replaceChildren();
   inbox.classList.toggle("has-items",result.messages.length>0);
   if(!result.messages.length){
    const empty=document.createElement("div");
    const heading=document.createElement("strong");heading.textContent="No messages yet";
    const detail=document.createElement("p");detail.textContent="Encrypted envelopes will appear here when sent to your PIN.";
    empty.append(heading,detail);inbox.append(empty);
   }else for(const message of result.messages){
    const row=document.createElement("div");row.className="envelope";
    const sender=document.createElement("strong");sender.textContent=message.sender;
    const note=document.createElement("small");note.textContent="Encrypted envelope received. Decryption is not implemented.";
    const time=document.createElement("small");time.textContent="Received: "+message.receivedAt;
    row.append(sender,note,time);inbox.append(row);
   }
   status.textContent=result.messages.length+" encrypted envelope(s) in your inbox. Decryption is not available yet.";
  }catch{status.textContent="Inbox refresh failed.";}
  finally{refresh.disabled=false;}
 }
 refresh.addEventListener("click",refreshInbox);
 try{
  const identity=await window.ZERO_DESKTOP.getIdentity();
  if(!identity.activated){pin.textContent="Unavailable";status.textContent=identity.error||"Activation unavailable";return;}
  pin.textContent=identity.pin;
  copy.disabled=false;
  register.disabled=false;
  authenticate.disabled=false;
  authenticate.addEventListener("click",async()=>{
   authenticate.disabled=true;
   status.textContent="Authenticating device...";
   try{
    const result=await window.ZERO_DESKTOP.authenticateDevice();
    status.textContent=result.authenticated?"Device authenticated. Checking encrypted inbox...":result.error||"Authentication unavailable";
    if(result.authenticated){refresh.disabled=false;await refreshInbox();}
   }catch{status.textContent="Device authentication failed";}
   finally{authenticate.disabled=false;}
  });
  register.addEventListener("click",async()=>{
   register.disabled=true;
   status.textContent="Registering device identity...";
   try{const result=await window.ZERO_DESKTOP.registerDevice();status.textContent=result.registered?"Device PIN registered successfully. Messaging is not yet available.":result.error||"Registration unavailable";}
   catch{status.textContent="Device registration failed";}
   finally{register.disabled=false;}
  });
  copy.addEventListener("click",async()=>{
   try{await navigator.clipboard.writeText(identity.pin);copy.textContent="Copied";setTimeout(()=>copy.textContent="Copy",1500);}
   catch{status.textContent="Clipboard permission denied. Select the PIN to copy it.";}
  });
  status.textContent="Local device identity activated. Messaging service connection is pending.";
 }catch{pin.textContent="Unavailable";status.textContent="Device identity could not be loaded.";}
})();
