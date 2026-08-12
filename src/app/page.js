"use client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center transition-colors duration-500 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      
      {/* Navigation Bar */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className={`text-2xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
          TaskFlow
        </div>
        
        <div className="space-x-4 flex items-center">
          <Link href="/login" className={`font-medium transition ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
            Log in
          </Link>
          <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md">
            Sign up
          </Link>

          {/* Premium Dark Mode Toggle Button (Icon Only) */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-full transition-all duration-300 ml-2 ${
              darkMode 
                ? "bg-gray-800 text-yellow-400 hover:bg-gray-700 hover:rotate-12" 
                : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:-rotate-12"
            }`}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              /* Sun Icon (Light Mode එකට යන්න) */
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              /* Moon Icon (Dark Mode එකට යන්න) */
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="text-center px-4 max-w-3xl">
        <h1 className={`text-5xl md:text-6xl font-extrabold tracking-tight mb-6 transition-colors ${darkMode ? "text-white" : "text-gray-900"}`}>
          Manage your tasks with <span className={darkMode ? "text-blue-400" : "text-blue-600"}>confidence.</span>
        </h1>
        <p className={`text-lg md:text-xl mb-10 transition-colors ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          The simple, full-stack task management system built for high-performance teams. 
          Stay organized, focused, and get more done.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/register" className={`bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition ${darkMode ? "" : "shadow-lg shadow-blue-200"}`}>
            Get Started for Free
          </Link>
          <Link href="/dashboard" className={`border px-8 py-3 rounded-lg text-lg font-semibold transition shadow-sm ${
            darkMode 
              ? "bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700" 
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
          }`}>
            View Dashboard
          </Link>
        </div>
      </main>

    </div>
  );
}