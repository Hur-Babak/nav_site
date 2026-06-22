import { createContext, useContext, useState, type ReactNode } from "react";
import { isAuthed, login as doLogin, logout as doLogout, type LoginResult } from "../lib/auth";
import { LoginModal } from "./LoginModal";

interface AuthCtx {
  authed: boolean;
  login: (user: string, pass: string) => Promise<LoginResult>;
  logout: () => void;
  openLogin: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean>(() => isAuthed());
  const [loginOpen, setLoginOpen] = useState(false);

  const login = async (user: string, pass: string): Promise<LoginResult> => {
    const r = await doLogin(user, pass);
    if (r.ok) setAuthed(true);
    return r;
  };

  const logout = () => {
    doLogout();
    setAuthed(false);
  };

  return (
    <Ctx.Provider value={{ authed, login, logout, openLogin: () => setLoginOpen(true) }}>
      {children}
      {loginOpen && (
        <LoginModal onClose={() => setLoginOpen(false)} onSuccess={() => setLoginOpen(false)} />
      )}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
