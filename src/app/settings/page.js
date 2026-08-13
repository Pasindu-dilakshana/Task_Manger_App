"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/lib/useAuth";

export default function SettingsPage() {
  const { user, isLoggedIn, authChecked, logout, refresh } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "" });
  const [profileStatus, setProfileStatus] = useState({ type: "", message: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState({ type: "", message: "" });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("taskflow_dark_mode");
    if (saved !== null) setDarkMode(saved === "true");
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({ firstName: user.firstName || "", lastName: user.lastName || "" });
    }
  }, [user]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("taskflow_dark_mode", String(next));
      return next;
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileStatus({ type: "", message: "" });
    setSavingProfile(true);
    try {
      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await response.json();
      if (!response.ok) {
        setProfileStatus({ type: "error", message: data.error || "Failed to update profile" });
        return;
      }
      await refresh();
      setProfileStatus({ type: "success", message: "Profile updated." });
    } catch (error) {
      setProfileStatus({ type: "error", message: "Could not reach the server." });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus({ type: "", message: "" });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    setSavingPassword(true);
    try {
      const response = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setPasswordStatus({ type: "error", message: data.error || "Failed to update password" });
        return;
      }
      setPasswordStatus({ type: "success", message: "Password updated." });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setPasswordStatus({ type: "error", message: "Could not reach the server." });
    } finally {
      setSavingPassword(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-500 ${darkMode ? "bg-[#0F172A] text-slate-100" : "bg-[#F8FAFC] text-slate-800"}`}>

      <Sidebar active="settings" isLoggedIn={isLoggedIn} user={user} onLogout={logout} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className={`h-24 backdrop-blur-2xl border-b flex items-center justify-between px-8 z-20 shrink-0 sticky top-0 transition-colors duration-500 ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"}`}>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Settings</h2>
            <p className={`text-sm font-bold uppercase tracking-wider mt-1 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
              Manage your account and preferences
            </p>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={toggleDarkMode} className={`relative p-2.5 rounded-full shadow-sm hover:shadow-md border transition-colors ${darkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-indigo-400" : "bg-white border-slate-200 text-slate-500 hover:text-indigo-600"}`}>
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>
            <div className={`w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-fuchsia-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/30 ring-4 transition-transform hover:scale-105 ${darkMode ? "ring-slate-800" : "ring-white"}`}>
              {isLoggedIn ? `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() : "G"}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          <div className="max-w-2xl mx-auto w-full space-y-8">

            {!isLoggedIn && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💡</span>
                  <p className="text-sm font-medium">
                    <strong className="font-bold">Guest Mode:</strong> Sign up to manage a profile and password.
                  </p>
                </div>
                <Link href="/register" className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-sm font-bold rounded-xl transition-colors">
                  Sign up
                </Link>
              </div>
            )}

            {/* Preferences */}
            <section className={`p-6 rounded-[1.5rem] border ${darkMode ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
              <h3 className="text-lg font-black mb-4">Preferences</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Dark mode</p>
                  <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Applies across the dashboard and settings.</p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`w-14 h-8 rounded-full flex items-center px-1 transition-colors ${darkMode ? "bg-indigo-600 justify-end" : "bg-slate-300 justify-start"}`}
                  aria-label="Toggle dark mode"
                >
                  <span className="w-6 h-6 bg-white rounded-full shadow-md"></span>
                </button>
              </div>
            </section>

            {/* Profile */}
            <section className={`p-6 rounded-[1.5rem] border ${darkMode ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200 shadow-sm"} ${!isLoggedIn ? "opacity-50 pointer-events-none" : ""}`}>
              <h3 className="text-lg font-black mb-4">Profile</h3>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold mb-1">First Name</label>
                    <input
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-300"}`}
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold mb-1">Last Name</label>
                    <input
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-300"}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email Address</label>
                  <input
                    value={user?.email || ""}
                    disabled
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none cursor-not-allowed ${darkMode ? "bg-slate-900/50 border-slate-800 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-400"}`}
                  />
                </div>

                {profileStatus.message && (
                  <p className={`text-sm font-medium ${profileStatus.type === "error" ? "text-red-500" : "text-emerald-500"}`}>
                    {profileStatus.message}
                  </p>
                )}

                <button type="submit" disabled={savingProfile} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-60">
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </section>

            {/* Password */}
            <section className={`p-6 rounded-[1.5rem] border ${darkMode ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200 shadow-sm"} ${!isLoggedIn ? "opacity-50 pointer-events-none" : ""}`}>
              <h3 className="text-lg font-black mb-4">Change Password</h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-300"}`}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold mb-1">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-300"}`}
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-semibold mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-300"}`}
                    />
                  </div>
                </div>

                {passwordStatus.message && (
                  <p className={`text-sm font-medium ${passwordStatus.type === "error" ? "text-red-500" : "text-emerald-500"}`}>
                    {passwordStatus.message}
                  </p>
                )}

                <button type="submit" disabled={savingPassword} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-60">
                  {savingPassword ? "Updating..." : "Update Password"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
