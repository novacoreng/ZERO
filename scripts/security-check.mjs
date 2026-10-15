import {readFileSync,readdirSync,statSync} from "node:fs";
import {join,basename,extname} from "node:path";
const forbiddenNames=/^(?:\.env(?:\..*)?|.*\.(?:pem|key|p12|pfx|jks|keystore))$/i;
const secretPatterns=[
 /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
 /(?:api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"']{12,}["']/i
];
const ignored=new Set(["node_modules",".git","dist","build","coverage"]);
const textExtensions=new Set([".ts",".tsx",".js",".mjs",".cjs",".json",".md",".yml",".yaml",".sql"]);
function walk(dir){
 const out=[];
 for(const entry of readdirSync(dir)){
  if(ignored.has(entry))continue;
  const file=join(dir,entry);
  if(statSync(file).isDirectory())out.push(...walk(file));
  else out.push(file);
 }
 return out;
}
const violations=[];
for(const file of walk(".")){
 const normalized=file.replaceAll("\\","/");
 if(basename(file)!==".env.example"&&forbiddenNames.test(basename(file)))violations.push("forbidden secret-like file: "+normalized);
 if(!textExtensions.has(extname(file)))continue;
 const content=readFileSync(file,"utf8");
 if(secretPatterns.some(pattern=>pattern.test(content))&&!normalized.endsWith(".env.example"))violations.push("possible secret pattern: "+normalized);
}
if(violations.length){console.error(violations.join("\n"));process.exit(1);}
console.log("Security repository scan passed.");
