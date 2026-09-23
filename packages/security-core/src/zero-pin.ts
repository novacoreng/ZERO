export const ZERO_PIN_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
export const ZERO_PIN_BODY_LENGTH = 8;
export const ZERO_PIN_PATTERN = /^[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/;

export function normalizeZeroPin(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "").replace(/_/g, "-");
}

export function isValidZeroPin(value: string): boolean {
  return ZERO_PIN_PATTERN.test(normalizeZeroPin(value));
}

export function generateZeroPin(randomBytes: Uint8Array): string {
  if (randomBytes.length < ZERO_PIN_BODY_LENGTH) {
    throw new Error("Insufficient randomness for ZERO PIN generation");
  }
  let body = "";
  for (let i = 0; i < ZERO_PIN_BODY_LENGTH; i += 1) {
    const byte = randomBytes[i];
    if (byte === undefined) throw new Error("Missing random byte");
    body += ZERO_PIN_ALPHABET[byte % ZERO_PIN_ALPHABET.length];
  }
  return body.slice(0, 4) + "-" + body.slice(4);
}

export async function derivePinLookupDigest(
  normalizedPin: string,
  serverSecret: Uint8Array
): Promise<ArrayBuffer> {
  const pin = normalizeZeroPin(normalizedPin);
  if (!isValidZeroPin(pin)) throw new Error("Invalid ZERO PIN");
  if (serverSecret.length < 32) throw new Error("Lookup secret must be at least 256 bits");
  const key = await crypto.subtle.importKey(
    "raw", serverSecret, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  return crypto.subtle.sign("HMAC", key, new TextEncoder().encode(pin));
}

export const ZERO_PIN_POLICY = Object.freeze({
  bodyLength: 8,
  entropyBits: 40,
  separator: "-",
  lookup: "HMAC-SHA-256",
  enumerationDefense: "rate-limit-and-uniform-response",
  identitySeparation: "account-id-and-device-keys-are-distinct",
  regeneration: "explicit-user-action-with-cooldown-and-old-pin-replacement"
} as const);
