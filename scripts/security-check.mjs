import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const forbiddenNames = /(^|\\/)(\\.env|\\.env\\.|.*\\.(pem|key|p12|pfx|jks|keystore))$/i;
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:api[_-]?key|secret|password|token)\\s*[:=]\\s*["'][^"']{12,}["']/i
];

const ignored = new Set(["node_modules", ".git", "dist", "build", "coverage"]);
const textExtensions = new Set([".ts",".tsx",".js",".mjs",".cjs",".json",".md",".yml",".yaml",".sql",".env.example"]);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (ignored.has(entry)) continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

const violations = [];
for (const file of walk(".")) {
  const normalized = file.replaceAll("\\\\", "/");
  if (forbiddenNames.test(normalized)) violations.push(`forbidden secret-like file: ${normalized}`);
  const ext = normalized.includes(".") ? "." + normalized.split(".").pop() : "";
  if (!textExtensions.has(ext)) continue;
  const content = readFileSync(file, "utf8");
  for (const pattern of secretPatterns) {
    if (pattern.test(content) && !normalized.endsWith(".env.example")) {
      violations.push(`possible secret pattern: ${normalized}`);
      break;
    }
  }
}

if (violations.length) {
  console.error(violations.join("\\n"));
  process.exit(1);
}

console.log("Security repository scan passed.");
