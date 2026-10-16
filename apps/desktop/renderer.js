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
  welcomeText.textContent=view==="chats"?"No signups. Your device creates its own PIN. Verified encrypted messages appear after connecting your device.":view==="contacts"?"Verify a contact PIN to enable experimental encrypted messaging.":"Your device PIN and registration controls are in the sidebar.";
 }
 navs.forEach(name=>document.getElementById("nav-"+name).addEventListener("click",()=>show(name)));
 document.getElementById("nav-back").addEventListener("click",()=>show("chats"));
 document.getElementById("new-chat").addEventListener("click",()=>{show("contacts");document.getElementById("status").textContent="Connect your device, then verify a contact PIN to start an encrypted chat.";});
 document.getElementById("search").addEventListener("input",event=>{if(event.target.value.trim())document.getElementById("status").textContent="Enter a contact PIN and select Verify contact.";});

 let selectedRecipient=null;
 const messageInput=document.getElementById("message-input");
 const sendButton=document.getElementById("send-message");
 const status=document.getElementById("status");
 async function showDecrypted(){
  refresh.disabled=true;
  let result;
  try{result=await window.ZERO_DESKTOP.readMessages();}
  catch{status.textContent="Inbox refresh failed";refresh.disabled=false;return;}
  finally{refresh.disabled=false;}
  if(!result.connected){status.textContent=result.error||"Inbox unavailable";return;}
  inbox.replaceChildren();inbox.classList.toggle("has-items",result.messages.length>0);
  if(!result.messages.length){const empty=document.createElement("div");empty.textContent="No verified, decryptable messages yet.";inbox.append(empty);}
  for(const message of result.messages){
   const row=document.createElement("div");row.className="envelope";
   const sender=document.createElement("strong");sender.textContent=message.sender;
   const body=document.createElement("p");body.textContent=message.plaintext;
   const time=document.createElement("small");time.textContent="Received: "+message.receivedAt;
   row.append(sender,body,time);inbox.append(row);
  }
  status.textContent=result.messages.length+" verified decrypted message(s). Experimental protocol.";
 }
 sendButton.addEventListener("click",async()=>{
  if(!selectedRecipient||!messageInput.value.trim())return;
  sendButton.disabled=true;
  try{
   const result=await window.ZERO_DESKTOP.sendMessage(selectedRecipient,messageInput.value);
   status.textContent=result.sent?"Encrypted message queued for "+selectedRecipient:result.error||"Send failed";
   if(result.sent)messageInput.value="";
  }catch{status.textContent="Encrypted message send failed";}
  finally{sendButton.disabled=!selectedRecipient;}
 });
 messageInput.addEventListener("keydown",event=>{if(event.key==="Enter"&&!sendButton.disabled)sendButton.click();});

 const copy=document.getElementById("copy");
 const register=document.getElementById("register");
 const authenticate=document.getElementById("authenticate");
 const refresh=document.getElementById("refresh-inbox");
 const inbox=document.getElementById("inbox-list");
 const lookup=document.getElementById("lookup");
 lookup.addEventListener("click",async()=>{
  const requestedPin=document.getElementById("search").value.trim().toUpperCase();
  lookup.disabled=true;
  selectedRecipient=null;
  messageInput.disabled=true;
  sendButton.disabled=true;
  status.textContent="Verifying contact public key...";
  try{
   const result=await window.ZERO_DESKTOP.lookupContact(requestedPin);
   if(!result.found){status.textContent=result.error||"Contact not found";return;}
   selectedRecipient=result.encryptionReady?result.pin:null;
   messageInput.disabled=!selectedRecipient;sendButton.disabled=!selectedRecipient;
   status.textContent=result.encryptionReady?"Contact identity and signed encryption key verified. Experimental encrypted messaging is available.":"Contact identity verified, but no signed encryption key is published.";
   show("contacts");
   inbox.replaceChildren();
   inbox.classList.add("has-items");
   const row=document.createElement("div");row.className="envelope";
   const heading=document.createElement("strong");heading.textContent=result.pin;
   const detail=document.createElement("small");detail.textContent=result.encryptionReady?"Identity and signed encryption key verified. Not saved as a trusted contact.":"Identity verified; encryption key not published. Not saved as a trusted contact.";
   row.append(heading,detail);inbox.append(row);
  }catch{status.textContent="Contact verification failed";}
  finally{lookup.disabled=false;}
 });
 refresh.addEventListener("click",showDecrypted);
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
    if(result.authenticated){
     refresh.disabled=false;lookup.disabled=false;
     const publication=await window.ZERO_DESKTOP.publishEncryptionKey();
     if(!publication.published)status.textContent=publication.error||"Encryption key publication failed";
     await showDecrypted();
    }
   }catch{status.textContent="Device authentication failed";}
   finally{authenticate.disabled=false;}
  });
  register.addEventListener("click",async()=>{
   register.disabled=true;
   status.textContent="Registering device identity...";
   try{const result=await window.ZERO_DESKTOP.registerDevice();status.textContent=result.registered?"Device PIN registered. Connect your device to activate encrypted messaging.":result.error||"Registration unavailable";}
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
