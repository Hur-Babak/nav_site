import { createContext, useContext, useState, type ReactNode } from "react";
import { isAuthed, login as doLogin, logout as doLogout, type LoginResult } from "../lib/auth";

interface AuthCtx {
  authed: boolean;
  login: (user: string, pass: string) => Promise<LoginResult>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean>(() => isAuthed());

  const login = async (user: string, pass: string): Promise<LoginResult> => {
    const r = await doLogin(user, pass);
    if (r.ok) setAuthed(true);
    return r;
  };

  const logout = () => {
    doLogout();
    setAuthed(false);
  };

  return <Ctx.Provider value={{ authed, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
