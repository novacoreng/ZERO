import http from "node:http";
import {DeviceRegistry} from "./device-registry.mjs";
const port=Number(process.env.PORT||8787);
const registry=new DeviceRegistry({file:process.env.ZERO_DEVICE_REGISTRY_FILE||undefined});
if(!process.env.ZERO_DEVICE_REGISTRY_FILE)console.warn("ZERO API: registry is ephemeral. Do not use for production.");
const counters=new Map();
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
 if(req.method!=="POST"||!["/v1/devices/challenge","/v1/devices/register","/v1/session/challenge","/v1/session/authenticate"].includes(req.url))return json(res,404,{error:"Not found"});
 if(!req.headers["content-type"]?.startsWith("application/json"))return json(res,415,{error:"JSON required"});
 let body="";
 try{
  for await(const chunk of req){body+=chunk;if(body.length>4096){req.destroy();return;}}
  const input=JSON.parse(body);
  if(!input||typeof input!=="object"||Array.isArray(input))throw new Error("Invalid request");
  if(req.url==="/v1/devices/challenge")return json(res,200,registry.challenge(input.publicKey));
  if(req.url==="/v1/session/challenge")return json(res,200,registry.challenge(input.publicKey,"session"));
  if(req.url==="/v1/session/authenticate")return json(res,200,registry.authenticate(input));
  return json(res,200,registry.register(input));
 }catch{return json(res,400,{error:"Invalid device registration request"});}
});
server.listen(port,"127.0.0.1",()=>console.log("ZERO device registry listening on localhost:"+port));
