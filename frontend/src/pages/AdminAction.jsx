import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, ShieldCheck, ChevronRight, FileText } from 'lucide-react';
import api from '../api';

export default function AdminAction() {
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [pdfs, setPdfs] = useState([]);

  // 1. Initial Login
  const handleLogin = () => {
    if (password === 'pdforganizer') {
      setIsAuthed(true);
      fetchSubjects();
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  // 2. Data Fetching
  const fetchSubjects = async () => {
    const res = await api.get('/subjects/');
    setSubjects(res.data);
  };

  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject);
    setSelectedModule(null);
    setPdfs([]);
    const res = await api.get(`/subjects/${subject.id}/modules/`);
    setModules(res.data);
  };

  const handleModuleSelect = async (module) => {
    setSelectedModule(module);
    const res = await api.get(`/modules/${module.id}/pdfs/`);
    setPdfs(res.data);
  };

  // 3. Deletion Logic
  const deletePdf = async (pdfId) => {
    if (window.confirm("Confirm permanent deletion of this PDF?")) {
      try {
        await api.delete(`/pdfs/${pdfId}/`, { 
          headers: { 'Admin-Auth': 'pdforganizer' } 
        });
        setPdfs(pdfs.filter(p => p.id !== pdfId));
        alert("PDF Deleted successfully.");
      } catch (err) {
        alert("Delete Failed: " + err.message);
      }
    }
  };

  if (!isAuthed) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full text-center space-y-6">
          <ShieldCheck className="h-16 w-16 text-blue-600 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-800">Admin Control Panel</h1>
          <input 
            type="password" 
            placeholder="Identity Secret"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
          >
            Authenticate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <ShieldCheck className="text-blue-600" /> Administrative Dashboard
        </h1>
        <button onClick={() => window.location.reload()} className="text-sm font-semibold text-slate-400 hover:text-red-500">Log Out</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step 1: Subjects */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-slate-400 flex items-center gap-2 uppercase tracking-widest text-xs">01 Select Subject</h2>
          <div className="space-y-2">
            {subjects.map(sub => (
              <button 
                key={sub.id} 
                onClick={() => handleSubjectSelect(sub)}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${selectedSubject?.id === sub.id ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-700'}`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Modules */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-slate-400 flex items-center gap-2 uppercase tracking-widest text-xs">02 Select Module</h2>
          {selectedSubject ? (
            <div className="space-y-2">
              {modules.map(mod => (
                <button 
                  key={mod.id} 
                  onClick={() => handleModuleSelect(mod)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${selectedModule?.id === mod.id ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  {mod.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-slate-300 text-sm italic">Choose a subject first...</p>
          )}
        </div>

        {/* Step 3: PDFs Management */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-slate-400 flex items-center gap-2 uppercase tracking-widest text-xs">03 Manage Records</h2>
          {selectedModule ? (
            <div className="space-y-4">
              {pdfs.length > 0 ? pdfs.map(pdf => (
                <div key={pdf.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="text-blue-500 shrink-0" />
                    <span className="truncate text-sm font-bold text-slate-700">{pdf.title}</span>
                  </div>
                  <div className="flex gap-2">
                    <a href={pdf.file_url} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 bg-white rounded-lg border border-slate-100"><Eye size={16} /></a>
                    <button onClick={() => deletePdf(pdf.id)} className="p-2 text-slate-400 hover:text-red-600 bg-white rounded-lg border border-slate-100"><Trash2 size={16} /></button>
                  </div>
                </div>
              )) : (
                <p className="text-slate-400 text-center py-10 italic">No PDFs in this module.</p>
              )}
            </div>
          ) : (
            <p className="text-slate-300 text-sm italic">Select a module to see files...</p>
          )}
        </div>
      </div>
    </div>
  );
}
