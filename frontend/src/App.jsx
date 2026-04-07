import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubjectDetail from './pages/SubjectDetail';
import ModuleDetail from './pages/ModuleDetail';
import Upload from './pages/Upload';
import AdminAction from './pages/AdminAction';

import { useState, useEffect } from 'react';

function App() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30">
        <Navbar isDark={isDark} toggleDark={() => setIsDark(!isDark)} />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/subject/:id" element={<SubjectDetail />} />
            <Route path="/module/:id" element={<ModuleDetail />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/admin-control" element={<AdminAction />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
