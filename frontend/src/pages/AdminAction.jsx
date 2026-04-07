import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, ShieldCheck, FileText, ArrowLeft, Layers, Database, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function AdminAction() {
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [pdfs, setPdfs] = useState([]);

  const handleLogin = () => {
    if (password === 'pdforganizer') {
      setIsAuthed(true);
      api.get('/subjects/').then(res => setSubjects(res.data));
    } else {
      alert("Unauthorized Access Attempt");
    }
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

  const deletePdf = async (pdfId) => {
    if (window.confirm("Confirm permanent deletion? This action mirrors instantly to the portal.")) {
      try {
        await api.delete(`/pdfs/${pdfId}/`, { headers: { 'Admin-Auth': 'pdforganizer' } });
        setPdfs(pdfs.filter(p => p.id !== pdfId));
      } catch (err) {
        alert("Sync Error: " + (err.response?.data?.detail || err.message));
      }
    }
  };

  if (!isAuthed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505] px-4 font-sans selection:bg-blue-600">
        <div className="max-w-md w-full relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-[3rem] blur-xl opacity-20 animate-pulse"></div>
          <div className="relative bg-[#0d0d0d] p-12 rounded-[2.5rem] border border-white/5 text-center shadow-2xl">
            <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-blue-500/20 shadow-inner">
              <ShieldCheck className="h-10 w-10 text-blue-500" />
            </div>
            <div className="mb-10">
              <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">Core Auth</h1>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Encrypted Session Required</p>
            </div>
            <div className="space-y-6">
              <input 
                type="password" 
                placeholder="ACCESS TOKEN"
                className="w-full px-8 py-5 bg-black/50 border border-white/10 rounded-[1.5rem] outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-black text-center text-white placeholder:text-white/5 tracking-[0.5em] text-lg uppercase"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button onClick={handleLogin} className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all active:scale-95">
                Grant Access
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 p-6 lg:p-12 font-sans selection:bg-blue-600 selection:text-white">
      {/* Dynamic Header */}
      <div className="max-w-[1600px] mx-auto mb-16 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center gap-4 text-blue-500 mb-4 bg-blue-500/5 px-4 py-2 rounded-full border border-blue-500/10 self-center lg:self-start">
             <Zap size={14} className="fill-current" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">Admin Overlay v2.0</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-4">
            Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Node</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] max-w-sm leading-relaxed">
            Direct database synchronization portal. All mutations are reflected in real-time.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="px-8 py-5 bg-white/5 border border-white/5 rounded-[2rem] font-black text-white hover:bg-white/10 transition-all flex items-center gap-4 group">
             <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
             <span className="uppercase text-[10px] tracking-[0.3em]">Exit Portal</span>
          </Link>
          <button onClick={() => window.location.reload()} className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center hover:shadow-[0_0_50px_rgba(37,99,235,0.3)] hover:scale-110 active:scale-90 transition-all cursor-pointer">
             <Layers size={20} />
          </button>
        </div>
      </div>

      {/* Control Surface */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        
        {/* Navigation Track 1 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-8">
             <h2 className="font-black text-white/20 uppercase tracking-[0.4em] text-[10px]">01 Select Subject</h2>
             <Database size={14} className="text-white/10" />
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-6 space-y-4 backdrop-blur-3xl shadow-2xl">
            {subjects.map(sub => (
              <button 
                key={sub.id} 
                onClick={() => handleSubjectSelect(sub)}
                className={`w-full text-left px-8 py-7 rounded-[2rem] font-black transition-all flex items-center justify-between group relative overflow-hidden ${selectedSubject?.id === sub.id ? 'bg-blue-600 text-white border-transparent' : 'bg-white/[0.03] text-slate-500 hover:text-white border border-white/[0.03] hover:border-white/10'}`}
              >
                <div className="relative z-10">
                  <p className="text-sm tracking-tight uppercase mb-1">{sub.name}</p>
                  <p className={`text-[8px] font-black uppercase tracking-widest ${selectedSubject?.id === sub.id ? 'text-white/50' : 'text-slate-600'}`}>Class Structure</p>
                </div>
                <ChevronRight size={16} className={`relative z-10 transition-transform ${selectedSubject?.id === sub.id ? 'translate-x-0' : '-translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Track 2 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-8">
             <h2 className="font-black text-white/20 uppercase tracking-[0.4em] text-[10px]">02 Choose Module</h2>
             <Layers size={14} className="text-white/10" />
          </div>
          <div className={`bg-white/[0.02] border border-white/5 rounded-[3rem] p-6 space-y-4 backdrop-blur-3xl transition-all duration-700 ${!selectedSubject ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}>
            {modules.map(mod => (
              <button 
                key={mod.id} 
                onClick={() => handleModuleSelect(mod)}
                className={`w-full text-left px-8 py-7 rounded-[2rem] font-black transition-all flex items-center justify-between group relative overflow-hidden ${selectedModule?.id === mod.id ? 'bg-cyan-500 text-slate-950 border-transparent shadow-[0_0_40px_rgba(6,182,212,0.3)]' : 'bg-white/[0.03] text-slate-500 hover:text-white border border-white/[0.03] hover:border-white/10'}`}
              >
                <div className="relative z-10">
                  <p className="text-xs font-black uppercase tracking-[0.2em]">Module <span className="text-lg tracking-tighter">{mod.module_number}</span></p>
                </div>
                <ChevronRight size={16} className={`relative z-10 transition-all ${selectedModule?.id === mod.id ? 'translate-x-0' : '-translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
              </button>
            ))}
            {selectedSubject && modules.length === 0 && (
              <div className="py-20 text-center">
                 <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">No Modules Indexed</p>
              </div>
            )}
          </div>
        </div>

        {/* Data Stream 3 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-8">
             <h2 className="font-black text-red-500/30 uppercase tracking-[0.4em] text-[10px]">03 Sync Control</h2>
             <Zap size={14} className="text-red-500/20" />
          </div>
          <div className={`bg-white/[0.02] border border-white/5 rounded-[3rem] p-6 space-y-4 backdrop-blur-3xl transition-all duration-700 ${!selectedModule ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}>
            {pdfs.length > 0 ? pdfs.map(pdf => (
              <div key={pdf.id} className="p-8 bg-black/50 rounded-[2.5rem] border border-white/5 flex flex-col gap-6 group hover:border-blue-500/30 transition-all duration-500">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/5">
                    <FileText className="text-blue-500" size={20} />
                  </div>
                  <div className="flex gap-2">
                    <a href={pdf.file_url} target="_blank" className="h-12 w-12 bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all border border-white/5">
                      <Eye size={18} />
                    </a>
                    <button onClick={() => deletePdf(pdf.id)} className="h-12 w-12 bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all border border-white/5">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-white uppercase tracking-tight truncate">{pdf.pdf_type.replace('_', ' ')}</p>
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Resource ID: DB-{pdf.id}</p>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center bg-red-950/5 border border-red-900/10 rounded-[2.5rem]">
                 <p className="text-[10px] font-black text-red-900/40 uppercase tracking-[0.3em]">Zero Active Records</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="max-w-[1600px] mx-auto mt-20 pt-10 border-t border-white/5 flex items-center justify-center lg:justify-start gap-10">
         <div className="flex items-center gap-3 grayscale opacity-30">
            <div className="w-10 h-10 bg-white rounded-xl"></div>
            <span className="font-black text-white tracking-tighter text-xl italic uppercase">Antigravity</span>
         </div>
         <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-800">Automated PDF Orchestration Engine</p>
      </div>
    </div>
  );
}
