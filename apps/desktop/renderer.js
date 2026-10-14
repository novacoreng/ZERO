"use strict";
(async()=>{
 const pin=document.getElementById("pin");
 const status=document.getElementById("status");
 const copy=document.getElementById("copy");
 const register=document.getElementById("register");
 try{
  const identity=await window.ZERO_DESKTOP.getIdentity();
  if(!identity.activated){pin.textContent="Unavailable";status.textContent=identity.error||"Activation unavailable";return;}
  pin.textContent=identity.pin;
  copy.disabled=false;
  register.disabled=false;
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
