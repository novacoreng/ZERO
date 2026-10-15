import {MessageRelay} from "./message-relay.mjs";
import http from "node:http";
import {DeviceRegistry} from "./device-registry.mjs";
const port=Number(process.env.PORT||8787);
const registry=new DeviceRegistry({file:process.env.ZERO_DEVICE_REGISTRY_FILE||undefined});
if(!process.env.ZERO_DEVICE_REGISTRY_FILE)console.warn("ZERO API: registry is ephemeral. Do not use for production.");
const counters=new Map();
const relay=new MessageRelay();
const MAX_JSON_BYTES=96*1024;
function rateLimit(ip){
 const now=Date.now();const old=counters.get(ip);
 const entry=!old||now-old.start>60_000?{start:now,count:0}:old;
 entry.count++;counters.set(ip,entry);
 if(counters.size>20000)for(const [key,v] of counters)if(now-v.start>60_000)counters.delete(key);
 return entry.count<=60;
}
function json(res,status,data){
 res.writeHead(status,{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff","access-control-allow-origin":"null"});
 res.end(JSON.stringify(data));
}
const server=http.createServer(async(req,res)=>{
 const ip=req.socket.remoteAddress||"unknown";
 if(!rateLimit(ip))return json(res,429,{error:"Rate limit exceeded"});
 if(req.method==="GET"&&req.url==="/health")return json(res,200,{status:"ok",service:"zero-device-registry"});
 if(req.method==="GET"&&req.url==="/v1/messages/inbox"){
  const auth=req.headers.authorization||"";
  const device=registry.authorize(auth.startsWith("Bearer ")?auth.slice(7):"");
  return json(res,device?200:401,device?{messages:relay.inbox(device.pin)}:{error:"Authentication required"});
 }
 if(req.method==="GET"&&req.url==="/v1/session/me"){
  const auth=req.headers.authorization||"";
  const device=registry.authorize(auth.startsWith("Bearer ")?auth.slice(7):"");
  return json(res,device?200:401,device||{error:"Authentication required"});
 }
 if(req.method==="GET"&&req.url?.startsWith("/v1/devices/")){
  const pin=decodeURIComponent(req.url.slice("/v1/devices/".length));
  const device=registry.lookup(pin);
  return json(res,device?200:404,device||{error:"Device not found"});
 }
 if(req.method!=="POST"||!["/v1/devices/challenge","/v1/devices/register","/v1/session/challenge","/v1/session/authenticate","/v1/messages/send","/v1/messages/acknowledge"].includes(req.url))return json(res,404,{error:"Not found"});
 if(!req.headers["content-type"]?.startsWith("application/json"))return json(res,415,{error:"JSON required"});
 let body="";
 let bytes=0;
 try{
  for await(const chunk of req){
   bytes+=chunk.length;
   if(bytes>MAX_JSON_BYTES)return json(res,413,{error:"Request too large"});
   body+=chunk.toString("utf8");
  }
  const input=JSON.parse(body);
  if(!input||typeof input!=="object"||Array.isArray(input))throw new Error("Invalid request");
  if(req.url==="/v1/messages/send"||req.url==="/v1/messages/acknowledge"){
   const auth=req.headers.authorization||"";
   const sender=registry.authorize(auth.startsWith("Bearer ")?auth.slice(7):"");
   if(!sender)return json(res,401,{error:"Authentication required"});
   if(req.url==="/v1/messages/acknowledge")return json(res,200,relay.acknowledge(sender.pin,input.id));
   if(!registry.lookup(input.recipient))return json(res,404,{error:"Recipient not registered"});
   return json(res,202,relay.send(sender.pin,input.recipient,input.encrypted));
  }
  if(req.url==="/v1/devices/challenge")return json(res,200,registry.challenge(input.publicKey));
  if(req.url==="/v1/session/challenge")return json(res,200,registry.challenge(input.publicKey,"session"));
  if(req.url==="/v1/session/authenticate")return json(res,200,registry.authenticate(input));
  return json(res,200,registry.register(input));
 }catch{return json(res,400,{error:"Invalid request"});}
});
server.listen(port,"127.0.0.1",()=>console.log("ZERO device registry listening on localhost:"+port));
