import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Layers, FileText, Loader2 } from 'lucide-react';
import api from '../api';

export default function SubjectDetail() {
  const { id } = useParams();
  const [modules, setModules] = useState([]);
  const [subjectInfo, setSubjectInfo] = useState({ name: 'Loading...' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app we'd fetch the subject name too, guessing from modules or from a specific endpoint
    api.get(`/subjects/${id}/modules/`)
      .then(res => {
        setModules(res.data);
        if(res.data.length > 0 && res.data[0].subject) setSubjectInfo({ name: `Subject Statistics` });
        else setSubjectInfo({ name: `Subject Info` });
      })
      .catch(err => {
        console.error("Backend fallback", err);
        setSubjectInfo({ name: `Subject ${id} Overview` });
        setModules(Array.from({length: 5}, (_, i) => ({
          id: i + 1,
          module_number: i + 1,
          pdfs: [{ pdf_type: 'notes' }, { pdf_type: 'question_paper' }]
        })));
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <nav className="flex mb-8 text-sm font-medium text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
        <span className="text-slate-900 dark:text-white">{subjectInfo.name}</span>
      </nav>

      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          {subjectInfo.name}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Select a module to view notes and past papers.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {modules.map(mod => (
          <Link
            key={mod.id}
            to={`/module/${mod.id}`}
            className="group relative p-6 bg-white dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
            
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center mb-4 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 transition-colors duration-300">
              <Layers className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
            </div>
            
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Module {mod.module_number}
            </h2>
            
            <div className="flex gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                <FileText className="w-3 h-3" />
                <span>{(mod.pdfs || []).filter(p => p.pdf_type === 'notes').length}</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                <span className="text-purple-500">Q</span>
                <span>{(mod.pdfs || []).filter(p => p.pdf_type === 'question_paper').length}</span>
              </div>
            </div>
          </Link>
        ))}
        {modules.length === 0 && (
          <div className="col-span-full p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">No modules available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
