import { describe, expect, it } from 'vitest';
import { encryptData, decryptData, hashPassphrase } from '../crypto';
import { parseVoiceCommand, isVoiceSupported } from '../speech';

describe('WebCrypto encryption (data security)', () => {
  it('encrypts and decrypts round-trips', async () => {
    const original = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==';
    const enc = await encryptData(original, 'my-passphrase');
    expect(enc.ciphertext).toBeTruthy();
    expect(enc.iv).toBeTruthy();
    expect(enc.salt).toBeTruthy();
    const dec = await decryptData(enc, 'my-passphrase');
    expect(dec).toBe(original);
  });
  it('wrong passphrase fails to decrypt', async () => {
    const enc = await encryptData('secret-data', 'correct-pass');
    await expect(decryptData(enc, 'wrong-pass')).rejects.toThrow();
  });
  it('different encryptions produce different ciphertext', async () => {
    const a = await encryptData('hello', 'pass');
    const b = await encryptData('hello', 'pass');
    expect(a.ciphertext).not.toBe(b.ciphertext); // random salt+IV
  });
  it('hashPassphrase is deterministic', async () => {
    const h1 = await hashPassphrase('test');
    const h2 = await hashPassphrase('test');
    expect(h1).toBe(h2);
    expect(h1.length).toBeGreaterThan(20);
  });
});

describe('Voice command parsing', () => {
  it('parses search intent', () => {
    expect(parseVoiceCommand('search react engineer')).toEqual({ intent: 'search', query: 'react engineer' });
    expect(parseVoiceCommand('find remote jobs in bangalore')).toEqual({ intent: 'search', query: 'remote jobs in bangalore' });
    expect(parseVoiceCommand('look for product manager')).toEqual({ intent: 'search', query: 'product manager' });
  });
  it('parses apply intent', () => {
    expect(parseVoiceCommand('apply to asha technologies')).toEqual({ intent: 'apply', query: 'asha technologies' });
    expect(parseVoiceCommand('apply for ml engineer')).toEqual({ intent: 'apply', query: 'ml engineer' });
  });
  it('parses save intent', () => {
    expect(parseVoiceCommand('save this job')).toEqual({ intent: 'save', query: 'this job' });
    expect(parseVoiceCommand('bookmark the data analyst role')).toEqual({ intent: 'save', query: 'the data analyst role' });
  });
  it('defaults to search for unknown commands', () => {
    expect(parseVoiceCommand('anything here')).toEqual({ intent: 'search', query: 'anything here' });
  });
});

describe('voice support detection', () => {
  it('returns boolean', () => {
    expect(typeof isVoiceSupported()).toBe('boolean');
  });
});

describe('seed data integrity', () => {
  it('has at least 10 jobs and 6 companies', async () => {
    const { seedState } = await import('../seed');
    const s = seedState();
    expect(s.jobs.length).toBeGreaterThanOrEqual(10);
    expect(s.companies.length).toBeGreaterThanOrEqual(6);
  });
});
