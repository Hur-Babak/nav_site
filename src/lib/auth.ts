// УВАГА: це клієнтський «замок» інтерфейсу, не справжня безпека.
// Пароль зберігається лише як SHA-256 (не відкритим текстом), є ліміт спроб і
// блокування. Реальний захист даних — у тому, що публікація міток вимагає git push.
//
// Поточні креди: логін "overlord", пароль "NavKorpus#2026".
// Щоб змінити: онови HASH = sha256(`${SALT}|<логін>|<пароль>`).

const SALT = "nav-salt-1";
const HASH = "0adee9afa81310aedcbe5a36710b727bf29a5a0c9c953f3f19a84475198dd703";

const SESSION_KEY = "nav.auth.session";
const FAIL_KEY = "nav.auth.fails";
const SESSION_TTL = 14 * 24 * 60 * 60 * 1000; // 14 днів
const MAX_FREE_ATTEMPTS = 5;

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function isAuthed(): boolean {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw) as { exp?: number };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

interface FailState {
  fails: number;
  lockedUntil: number;
}

function getFails(): FailState {
  try {
    const raw = localStorage.getItem(FAIL_KEY);
    if (raw) return JSON.parse(raw) as FailState;
  } catch {
    /* ignore */
  }
  return { fails: 0, lockedUntil: 0 };
}

export function lockRemainingMs(): number {
  return Math.max(0, getFails().lockedUntil - Date.now());
}

export interface LoginResult {
  ok: boolean;
  error?: "bad" | "locked";
  waitMs?: number;
}

export async function login(user: string, pass: string): Promise<LoginResult> {
  const remaining = lockRemainingMs();
  if (remaining > 0) return { ok: false, error: "locked", waitMs: remaining };

  const hash = await sha256(`${SALT}|${user.trim()}|${pass}`);
  if (hash === HASH) {
    localStorage.setItem(FAIL_KEY, JSON.stringify({ fails: 0, lockedUntil: 0 }));
    localStorage.setItem(SESSION_KEY, JSON.stringify({ exp: Date.now() + SESSION_TTL }));
    return { ok: true };
  }

  const st = getFails();
  const fails = st.fails + 1;
  let lockedUntil = 0;
  if (fails >= MAX_FREE_ATTEMPTS) {
    const over = fails - (MAX_FREE_ATTEMPTS - 1); // 1, 2, 3, ...
    const cooldown = Math.min(15 * 60 * 1000, 30 * 1000 * 2 ** (over - 1)); // 30с,60с,120с… ≤15хв
    lockedUntil = Date.now() + cooldown;
  }
  localStorage.setItem(FAIL_KEY, JSON.stringify({ fails, lockedUntil }));
  return { ok: false, error: "bad", waitMs: Math.max(0, lockedUntil - Date.now()) };
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}
