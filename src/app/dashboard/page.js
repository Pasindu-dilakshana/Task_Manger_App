"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const getTodayDateString = () => {
  return new Date().toLocaleDateString('en-CA'); 
};

const getDisplayDate = (dateString) => {
  const today = getTodayDateString();
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA');

  if (dateString === today) return "Today";
  if (dateString === yesterday) return "Yesterday";
  return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [greeting, setGreeting] = useState("Welcome back");
  const [headerDate, setHeaderDate] = useState("");
  
  const [filter, setFilter] = useState("All"); 
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const fetchTasks = async () => {
    if (isLoggedIn) {
      try {
        const response = await fetch("/api/tasks");
        const data = await response.json();
        const formattedTasks = data.map(task => ({
          id: task._id,
          text: task.title || "Untitled", 
          completed: task.completed || false,
          date: task.date || getTodayDateString(),
          time: task.time || "12:00 PM"
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    } else {
      const localTasks = localStorage.getItem("taskflow_guest_tasks");
      if (localTasks) {
        setTasks(JSON.parse(localTasks));
      }
    }
  };

  useEffect(() => {
    fetchTasks();

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    setHeaderDate(new Date().toLocaleDateString('en-US', options));
  }, [isLoggedIn]); 

  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newTaskObj = {
      id: isLoggedIn ? null : Date.now().toString(),
      text: newTask,
      completed: false,
      date: selectedDate, 
      time: timeString
    };

    if (isLoggedIn) {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTaskObj.text, date: newTaskObj.date, time: newTaskObj.time }),
      });
      fetchTasks(); 
    } else {
      const updatedTasks = [newTaskObj, ...tasks];
      setTasks(updatedTasks);
      localStorage.setItem("taskflow_guest_tasks", JSON.stringify(updatedTasks));
    }
    setNewTask("");
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updatedTasks);
    if (!isLoggedIn) localStorage.setItem("taskflow_guest_tasks", JSON.stringify(updatedTasks));
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    if (!isLoggedIn) localStorage.setItem("taskflow_guest_tasks", JSON.stringify(updatedTasks));
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    const updatedTasks = tasks.map((t) => t.id === id ? { ...t, text: editText } : t);
    setTasks(updatedTasks);
    if (!isLoggedIn) localStorage.setItem("taskflow_guest_tasks", JSON.stringify(updatedTasks));
    setEditingId(null);
  };

  const tasksForSelectedDate = tasks.filter(task => task.date === selectedDate);
  const totalTasks = tasksForSelectedDate.length;
  const completedTasks = tasksForSelectedDate.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;

  const filteredTasks = tasksForSelectedDate.filter(task => {
    if (filter === "Active") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  return (
    <div className={`min-h-screen flex font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-500 ${darkMode ? "bg-[#0F172A] text-slate-100" : "bg-[#F8FAFC] text-slate-800"}`}>
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#0B1121] hidden md:flex flex-col relative overflow-hidden shrink-0 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none"></div>
        <div className="h-24 flex items-center px-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/10">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">TaskFlow<span className="text-indigo-400">.</span></h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 relative z-10">
          <a href="#" className="flex items-center gap-4 bg-gradient-to-r from-indigo-500/10 to-transparent text-indigo-400 px-4 py-3.5 rounded-2xl font-bold border border-indigo-500/20 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-4 text-slate-400 hover:text-white hover:bg-white/5 px-4 py-3.5 rounded-2xl font-medium transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Settings
          </a>
        </nav>
        <div className="p-6 relative z-10">
          <Link href="/" className="flex items-center gap-4 text-slate-400 hover:text-red-400 hover:bg-red-400/10 px-4 py-3.5 rounded-2xl font-medium transition-all group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Log out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Dynamic Header */}
        <header className={`h-24 backdrop-blur-2xl border-b flex items-center justify-between px-8 z-20 shrink-0 sticky top-0 transition-colors duration-500 ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"}`}>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${darkMode ? "from-white to-slate-400" : "from-slate-800 to-slate-500"}`}>
                {greeting}, {isLoggedIn ? "John" : "Guest"}!
              </span>
              <span className="text-3xl animate-wave origin-bottom-right">👋</span>
            </h2>
            <p className={`text-sm font-bold uppercase tracking-wider mt-1 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
              {headerDate}
            </p>
          </div>
          
          <div className="flex items-center gap-5">
            <button onClick={() => setDarkMode(!darkMode)} className={`relative p-2.5 rounded-full shadow-sm hover:shadow-md border transition-colors ${darkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-indigo-400" : "bg-white border-slate-200 text-slate-500 hover:text-indigo-600"}`}>
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>
            <div className={`w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-fuchsia-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/30 ring-4 transition-transform hover:scale-105 ${darkMode ? "ring-slate-800" : "ring-white"}`}>
              {isLoggedIn ? "JD" : "G"}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          <div className={`absolute top-0 left-1/4 w-[30rem] h-[30rem] rounded-full blur-[100px] pointer-events-none transition-colors duration-700 ${darkMode ? "bg-indigo-900/30" : "bg-indigo-300/30"}`}></div>

          <div className="max-w-5xl mx-auto w-full relative">
            
            {/* GUEST MODE BANNER */}
            {!isLoggedIn && (
              <div className="mb-8 flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💡</span>
                  <p className="text-sm font-medium">
                    <strong className="font-bold">Guest Mode:</strong> Your tasks are saved locally to this browser. 
                  </p>
                </div>
                <Link href="/register" className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-sm font-bold rounded-xl transition-colors">
                  Sign up to sync
                </Link>
              </div>
            )}

            {/* Date Header & Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              
              {/* 🔥 BEAUTIFUL INTERACTIVE DATE CARD 🔥 */}
              <div className="relative group cursor-pointer inline-block">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  title="Choose a date"
                />
                <div className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-300 border ${
                  darkMode
                    ? "bg-slate-800/80 border-slate-700 hover:bg-slate-700 shadow-lg shadow-slate-900/20"
                    : "bg-white border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 shadow-sm"
                }`}>
                  <div className={`p-3 rounded-xl transition-colors ${
                    darkMode ? "bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30" : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100"
                  }`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div className="flex flex-col pr-4 border-r border-slate-200 dark:border-slate-700">
                    <span className={`text-[11px] font-extrabold uppercase tracking-widest ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Viewing Tasks For
                    </span>
                    <span className={`text-2xl font-black tracking-tight mt-0.5 ${darkMode ? "text-white" : "text-slate-900"}`}>
                      {getDisplayDate(selectedDate)}
                    </span>
                  </div>
                  <div className={`pl-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stats for the Selected Date */}
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-xl text-sm font-bold ${darkMode ? "bg-slate-800 text-slate-300" : "bg-white border border-slate-200 text-slate-600 shadow-sm"}`}>
                  Tasks: {totalTasks}
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-bold ${darkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm"}`}>
                  Done: {completedTasks}
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-bold ${darkMode ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 border border-rose-200 text-rose-700 shadow-sm"}`}>
                  Not Done: {activeTasks}
                </div>
              </div>
            </div>

            {/* Input Field */}
            <form onSubmit={addTask} className="mb-8 relative group z-20">
              <div className="absolute inset-y-0 left-2 pl-4 flex items-center pointer-events-none">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 group-focus-within:bg-indigo-600 group-focus-within:text-white ${darkMode ? "bg-slate-700 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                </div>
              </div>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder={`Add a new task for ${getDisplayDate(selectedDate)}...`}
                className={`w-full pl-16 pr-36 py-5 rounded-[2rem] border focus:ring-4 outline-none transition-all font-semibold text-lg ${
                  darkMode 
                    ? "bg-slate-800/90 border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-100 placeholder:text-slate-400" 
                    : "bg-white/90 border-slate-200 focus:border-indigo-400 focus:ring-indigo-500/20 shadow-xl shadow-slate-200/50 text-slate-800 placeholder:text-slate-400"
                }`}
              />
              <button type="submit" className={`absolute inset-y-2.5 right-3 text-white px-8 rounded-full font-bold transition-all active:scale-95 flex items-center gap-2 ${darkMode ? "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/40" : "bg-slate-900 hover:bg-indigo-600 shadow-lg shadow-slate-900/20"}`}>
                Create
              </button>
            </form>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6">
              {["All", "Active", "Completed"].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                    filter === f 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30" 
                      : (darkMode ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200" : "bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-200")
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Task List */}
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className={`flex flex-col items-center justify-center p-20 backdrop-blur-sm rounded-[2.5rem] border border-dashed text-center shadow-sm ${darkMode ? "bg-slate-800/50 border-slate-700" : "bg-white/50 border-slate-300"}`}>
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner ${darkMode ? "bg-slate-700" : "bg-indigo-50"}`}>
                    <span className="text-4xl">🍃</span>
                  </div>
                  <h4 className={`text-2xl font-black mb-2 ${darkMode ? "text-slate-200" : "text-slate-800"}`}>No tasks found</h4>
                  <p className={`font-medium text-lg max-w-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Looks like you have a clean slate for this day.</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`group flex items-center justify-between p-5 rounded-[1.5rem] transition-all duration-300 ${darkMode ? "bg-slate-800" : "bg-white"} ${
                      task.completed 
                        ? (darkMode ? "border border-slate-700 bg-slate-800/60" : "border border-slate-200 bg-slate-50") 
                        : (darkMode ? "border border-slate-700 hover:border-indigo-500/50 hover:-translate-y-0.5" : "shadow-lg shadow-slate-200/40 border border-white hover:border-indigo-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/10")
                    }`}
                  >
                    <div className="flex items-center gap-5 flex-1 cursor-pointer">
                      
                      <div onClick={() => toggleTask(task.id)} className={`relative w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300 ${
                        task.completed 
                          ? "bg-emerald-500 border-emerald-500 scale-95" 
                          : `border-slate-300 ${darkMode ? "border-slate-600 group-hover:bg-indigo-500/20" : "group-hover:bg-indigo-50"} group-hover:border-indigo-400`
                      }`}>
                        <svg className={`w-4 h-4 text-white transition-transform duration-300 ${task.completed ? "scale-100" : "scale-0"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center">
                        {editingId === task.id ? (
                          <form onSubmit={(e) => { e.preventDefault(); saveEdit(task.id); }} className="flex w-full">
                            <input 
                              autoFocus
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onBlur={() => saveEdit(task.id)}
                              className={`w-full bg-transparent outline-none font-semibold text-[16px] border-b-2 ${darkMode ? "text-slate-100 border-indigo-500" : "text-slate-800 border-indigo-400"}`}
                            />
                          </form>
                        ) : (
                          <>
                            <span 
                              onClick={() => toggleTask(task.id)}
                              className={`font-semibold text-[16px] transition-all duration-300 ${
                              task.completed 
                                ? (darkMode ? "text-slate-500 line-through decoration-slate-600 decoration-2" : "text-slate-400 line-through decoration-slate-300 decoration-2") 
                                : (darkMode ? "text-slate-200" : "text-slate-800")
                            }`}>
                              {task.text}
                            </span>
                            <span className={`text-xs font-semibold mt-1 flex items-center gap-1 ${task.completed ? (darkMode ? "text-slate-600" : "text-slate-400") : (darkMode ? "text-slate-400" : "text-slate-500")}`}>
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              {task.time}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {editingId !== task.id && (
                        <button onClick={() => startEditing(task)} className={`p-2.5 rounded-full transition-all ${darkMode ? "text-slate-400 hover:text-indigo-400 hover:bg-slate-700" : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"}`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      )}
                      <button onClick={() => deleteTask(task.id)} className={`p-2.5 rounded-full transition-all ${darkMode ? "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10" : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}