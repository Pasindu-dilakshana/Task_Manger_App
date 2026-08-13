"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// Fetches the current user (if any) from the httpOnly auth cookie.
// Returns { user, authChecked, refresh, logout }.
export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Failed to check auth", error);
      setUser(null);
      return null;
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Failed to log out", error);
    } finally {
      setUser(null);
      router.push("/");
    }
  }, [router]);

  return { user, isLoggedIn: !!user, authChecked, refresh, logout };
}
