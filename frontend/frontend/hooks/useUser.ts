"use client";
import { useState, useEffect, useCallback } from "react";
import { getStoredUser, setStoredUser, clearStoredUser, type StoredUser } from "@/lib/auth/user";
import { login as apiLogin } from "@/lib/auth/user";

export function useUser() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setLoading(false);
  }, []);

  const login = useCallback(async (displayName: string) => {
    const u = await apiLogin(displayName);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    clearStoredUser();
    setUser(null);
  }, []);

  return { user, loading, login, logout };
}