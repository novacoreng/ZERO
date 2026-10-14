"use strict";
(async()=>{
 const pin=document.getElementById("pin");
 const status=document.getElementById("status");
 const copy=document.getElementById("copy");
 try{
  const identity=await window.ZERO_DESKTOP.getIdentity();
  if(!identity.activated){pin.textContent="Unavailable";status.textContent=identity.error||"Activation unavailable";return;}
  pin.textContent=identity.pin;
  copy.disabled=false;
  copy.addEventListener("click",async()=>{
   try{await navigator.clipboard.writeText(identity.pin);copy.textContent="Copied";setTimeout(()=>copy.textContent="Copy",1500);}
   catch{status.textContent="Clipboard permission denied. Select the PIN to copy it.";}
  });
  status.textContent="Local device identity activated. Messaging service connection is pending.";
 }catch{pin.textContent="Unavailable";status.textContent="Device identity could not be loaded.";}
})();
