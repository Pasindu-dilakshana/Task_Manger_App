"use client";
import Link from "next/link";

export default function Sidebar({ active, isLoggedIn, user, onLogout, darkMode }) {
  const navItemClass = (isActive) =>
    `flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
      isActive
        ? "bg-gradient-to-r from-indigo-500/10 to-transparent text-indigo-400 border border-indigo-500/20"
        : "text-slate-400 hover:text-white hover:bg-white/5 font-medium border border-transparent"
    }`;

  return (
    <aside className="w-[280px] bg-[#0B1121] hidden md:flex flex-col relative overflow-hidden shrink-0 shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none"></div>
      <div className="h-24 flex items-center px-8 relative z-10">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/10">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">TaskFlow<span className="text-indigo-400">.</span></h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 relative z-10">
        <Link href="/dashboard" className={navItemClass(active === "dashboard")}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          Dashboard
        </Link>
        <Link href="/settings" className={navItemClass(active === "settings")}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Settings
        </Link>
      </nav>
      <div className="p-6 relative z-10">
        {isLoggedIn ? (
          <button onClick={onLogout} className="w-full flex items-center gap-4 text-slate-400 hover:text-red-400 hover:bg-red-400/10 px-4 py-3.5 rounded-2xl font-medium transition-all group text-left">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Log out
          </button>
        ) : (
          <Link href="/" className="flex items-center gap-4 text-slate-400 hover:text-red-400 hover:bg-red-400/10 px-4 py-3.5 rounded-2xl font-medium transition-all group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Back to Home
          </Link>
        )}
      </div>
    </aside>
  );
}
