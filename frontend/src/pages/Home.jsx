import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Folder, Search, Loader2 } from 'lucide-react';
import api from '../api';

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // If backend isn't available, we fallback to dummy data for aesthetics preview
    api.get('/subjects/')
      .then(res => setSubjects(res.data))
      .catch(err => {
        console.error("Backend not running, using mock data.", err);
        setSubjects([
          { id: 1, name: 'Operating Systems (OS)' },
          { id: 2, name: 'Mathematics (Maths)' },
          { id: 3, name: 'Database Management Systems (DBMS)' },
          { id: 4, name: 'Formal Languages and Automata Theory (FLAT)' },
          { id: 5, name: 'Managerial Economics and Financial Analysis (MEFA)' }
        ]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredSubjects = subjects.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdminPurge = async () => {
    if (window.confirm("ARE YOU SURE? This will delete ALL PDFs from the Cloud!")) {
      try {
        await api.delete('/admin-purge-all-pdfs/');
        alert("Wipe Complete! Database is clean.");
        window.location.reload();
      } catch (err) {
        alert("Wipe Failed: " + err.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading subjects...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
          Organize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Study Notes</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Access subject-wise and module-wise PDFs instantly. Find everything you need for your exams in one neat place.
        </p>
      </div>

      <div className="relative max-w-xl mx-auto mb-12">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 rounded-2xl border-none bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400"
          placeholder="Search for a subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map(subject => (
          <Link
            key={subject.id}
            to={`/subject/${subject.id}`}
            className="group relative bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Folder className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {subject.name}
              </h3>
            </div>
            
            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400 font-medium">View Modules</span>
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 text-slate-400">
                →
              </div>
            </div>
          </Link>
        ))}
        {filteredSubjects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No subjects found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
