import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubjectDetail from './pages/SubjectDetail';
import ModuleDetail from './pages/ModuleDetail';
import Upload from './pages/Upload';
import AdminAction from './pages/AdminAction';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans text-slate-800 dark:text-slate-100 selection:bg-indigo-500/30">
        <Navbar />
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
