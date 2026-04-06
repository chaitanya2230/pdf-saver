import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, UploadCloud } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
              <BookOpen size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              PDF Organizer
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/upload" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all duration-300 shadow-md shadow-indigo-600/20 active:scale-95"
            >
              <UploadCloud size={20} />
              <span>Upload Notes</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
