import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, UploadCloud, Moon, Sun } from 'lucide-react';

export default function Navbar({ isDark, toggleDark }) {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-500">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-lg shadow-indigo-500/10 group-hover:shadow-indigo-500/30">
              <BookOpen size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tighter uppercase leading-none mb-1">
                PDF ORGANIZER
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">Student Resource Portal</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDark}
              className="p-3 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl hover:scale-110 active:scale-95 transition-all duration-300 border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link 
              to="/upload" 
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest transition-all duration-300 shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              <UploadCloud size={18} />
              <span className="hidden sm:inline">Publish</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
