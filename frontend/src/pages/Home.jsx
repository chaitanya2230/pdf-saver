import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, GraduationCap, ArrowRight, ShieldAlert } from 'lucide-react';
import api from '../api';

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchSubjects = () => {
    setIsLoading(true);
    api.get('/subjects/')
      .then(res => setSubjects(res.data))
      .catch(err => console.error("Error fetching subjects:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAdminAuth = () => {
    const pw = prompt("Enter Admin Password to manage PDFs:");
    if (pw === "pdforganizer") {
      setIsAdmin(true);
      alert("Admin Access Granted! Your secret Trash icons are now active.");
    } else {
      alert("Access Denied.");
    }
  };

  const handleAdminPurge = async () => {
    if (window.confirm("ARE YOU SURE? This will delete ALL PDFs from the Cloud!")) {
      try {
        await api.delete('/admin-purge-all-pdfs/', { 
          headers: { 'Admin-Auth': 'pdforganizer' } 
        });
        alert("Wipe Complete! Cloud database is clean.");
        window.location.reload();
      } catch (err) {
        alert("Wipe Failed: " + err.message);
      }
    }
  };

  const filteredSubjects = subjects.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500 font-medium">Loading your library...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-8 md:p-16">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <GraduationCap className="h-5 w-5" />
            <span className="text-sm font-medium">Student Resources Portal</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate Your <br />
            <span className="text-blue-200">Study Game.</span>
          </h1>
          <p className="text-lg text-blue-50 leading-relaxed max-w-lg">
            Access, organize, and share your university curriculum PDFs in one premium repository. 
            Built for students, by students.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              to="/upload" 
              className="px-8 py-4 bg-white text-blue-700 rounded-2xl font-semibold shadow-xl shadow-blue-900/20 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
            >
              <span>Upload PDF</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
        
        {/* Abstract Background Design */}
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px]"></div>
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-400/20 rounded-full blur-[80px]"></div>
        </div>
      </section>

      {/* Subjects Explorer */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Your Curriculum</h2>
            <p className="text-slate-500">Pick a subject to explore modules and materials.</p>
          </div>
          
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search subjects..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject, index) => (
            <Link 
              key={subject.id} 
              to={`/subject/${subject.id}`}
              className="group relative bg-white p-8 rounded-3xl border border-slate-100 hover:border-blue-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
            >
              <div className="absolute top-6 right-8 text-slate-100 group-hover:text-blue-50 transition-colors font-black text-6xl select-none">
                {String(index + 1).padStart(2, '0')}
              </div>
              
              <div className="relative space-y-4">
                <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <BookOpen className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-slate-500 mt-2 text-sm">
                    Comprehensive study materials and past year papers for {subject.name.split(' (')[0]}.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-blue-600 font-semibold text-sm pt-2">
                  <span>Explore Modules</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-500">No subjects found matching your search.</p>
          </div>
        )}
      </section>

      {/* Secret Admin Access (Always at the bottom) */}
      <footer className="pt-20 border-t border-slate-100 flex flex-col items-center justify-center space-y-4">
        <button 
          onClick={handleAdminAuth}
          className="p-4 rounded-full text-slate-200 hover:text-blue-400 transition-colors"
          title="Admin Mode"
        >
          <ShieldAlert className="h-6 w-6" />
        </button>
        
        {isAdmin && (
          <button 
            onClick={handleAdminPurge}
            className="flex items-center space-x-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100"
          >
            <ShieldAlert className="h-5 w-5" />
            <span>NUKE ALL PDFs (Admin Only)</span>
          </button>
        )}
        <p className="text-sm text-slate-400 font-medium">© 2026 University PDF Repository. All rights reserved.</p>
      </footer>
    </div>
  );
}
