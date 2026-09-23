export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizePhone(value: string): string {
  return value.trim().replace(/[()\\s-]/g, "");
}

export function validateOtp(value: string): boolean {
  return /^\\d{6}$/.test(value);
}

export function validatePasskeyCredentialId(value: string): boolean {
  return value.length >= 16 && value.length <= 1024;
}
