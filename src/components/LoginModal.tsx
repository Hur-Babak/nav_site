import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useAuth } from "./AuthContext";
import { lockRemainingMs } from "../lib/auth";

export function LoginModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { login } = useAuth();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(() => Math.ceil(lockRemainingMs() / 1000));

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => Math.max(0, w - 1)), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy || wait > 0) return;
    setBusy(true);
    setErr("");
    const r = await login(user, pass);
    setBusy(false);
    if (r.ok) {
      onSuccess();
      return;
    }
    if (r.waitMs && r.waitMs > 0) {
      const s = Math.ceil(r.waitMs / 1000);
      setWait(s);
      setErr(`Забагато спроб. Зачекай ${s} с`);
    } else {
      setErr("Невірний логін або пароль");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        initial={{ scale: 0.94, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="w-full max-w-sm border border-[var(--border)] bg-[var(--panel)] p-6"
      >
        <p className="label-mono text-[var(--accent)]">// Доступ</p>
        <h3 className="font-display mt-2 text-2xl font-semibold uppercase tracking-wide">
          Авторизація
        </h3>
        <p className="mt-2 font-mono text-[11px] text-[var(--muted-2)]">
          Редагування міток доступне лише після входу.
        </p>

        <label className="mt-5 block">
          <span className="mb-1 block font-mono text-[11px] text-[var(--muted-2)]">Логін</span>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="username"
            className="input"
          />
        </label>
        <label className="mt-3 block">
          <span className="mb-1 block font-mono text-[11px] text-[var(--muted-2)]">Пароль</span>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="current-password"
            className="input"
          />
        </label>

        {err && <p className="mt-3 font-mono text-xs text-[var(--danger)]">{err}</p>}

        <div className="mt-5 flex gap-2">
          <button
            type="submit"
            disabled={busy || wait > 0}
            className="font-display flex-1 bg-[var(--accent)] px-4 py-3 text-sm font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {wait > 0 ? `Зачекай ${wait} с` : busy ? "Перевірка…" : "Увійти"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="label-mono border border-[var(--border)] px-4 transition-colors hover:border-[var(--accent)]"
          >
            Відміна
          </button>
        </div>
      </motion.form>
    </div>
  );
}
