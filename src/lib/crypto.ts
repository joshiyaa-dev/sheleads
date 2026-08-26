/**
 * WebCrypto AES-GCM encryption for photos and voice notes.
 * All crypto happens client-side — no data leaves the browser.
 */

const ALGO = 'AES-GCM';
const KEY_LENGTH = 256;

function toBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function fromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
    .then((baseKey) =>
      crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
        baseKey,
        { name: ALGO, length: KEY_LENGTH },
        false,
        ['encrypt', 'decrypt'],
      ),
    );
}

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  salt: string;
}

/** Encrypt a data URL (image) or raw string with AES-GCM. */
export async function encryptData(data: string, passphrase: string): Promise<EncryptedData> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const ciphertext = await crypto.subtle.encrypt({ name: ALGO, iv }, key, enc.encode(data));
  return {
    ciphertext: toBase64(ciphertext),
    iv: toBase64(iv),
    salt: toBase64(salt),
  };
}

/** Decrypt back to the original string. */
export async function decryptData(encrypted: EncryptedData, passphrase: string): Promise<string> {
  const key = await deriveKey(passphrase, fromBase64(encrypted.salt));
  const dec = new TextDecoder();
  const plain = await crypto.subtle.decrypt(
    { name: ALGO, iv: fromBase64(encrypted.iv) },
    key,
    fromBase64(encrypted.ciphertext),
  );
  return dec.decode(plain);
}

/** Hash a passphrase for storage (never store plaintext passphrases). */
export async function hashPassphrase(passphrase: string): Promise<string> {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-256', enc.encode(passphrase + 'sheleads-salt-v1'));
  return toBase64(hash);
}
