import { seedState } from './seed';
import type { SheLeadsState } from './types';

const KEY = 'sheleads_state_v1';

export function loadState(): SheLeadsState {
  if (typeof window === 'undefined') return seedState();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SheLeadsState>;
      return { ...seedState(), ...parsed } as SheLeadsState;
    }
  } catch { /* fallthrough */ }
  const s = seedState();
  saveState(s);
  return s;
}

export function saveState(s: SheLeadsState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function resetState(): SheLeadsState {
  if (typeof window === 'undefined') return seedState();
  localStorage.removeItem(KEY);
  return loadState();
}
