import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';
import api from '../api';

export default function Upload() {
  const [subjects, setSubjects] = useState([]);
  const [modules, setModules] = useState([]);
  
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [pdfType, setPdfType] = useState('notes');
  const [file, setFile] = useState(null);
  
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const navigate = useNavigate();

  useEffect(() => {
    api.get('/subjects/')
      .then(res => setSubjects(res.data))
      .catch(err => {
        setSubjects([
          { id: '1', name: 'Operating Systems' },
          { id: '2', name: 'Database Management Systems' }
        ]);
      });
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      api.get(`/subjects/${selectedSubject}/modules/`)
        .then(res => setModules(res.data))
        .catch(err => {
          setModules(Array.from({length: 5}, (_, i) => ({ id: i+1, module_number: i+1 })));
        });
    } else {
      setModules([]);
    }
  }, [selectedSubject]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !selectedModule) return;

    setUploading(true);
    setStatus(null);
    setProgress(10); // Start progress bar

    try {
      // 1. Upload to Supabase Storage
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      setProgress(30);

      const { data, error } = await supabase.storage
        .from('pdfs')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
         if (error.message.includes("Bucket not found")) {
            throw new Error("Storage Bucket 'pdfs' not found! Please create a PUBLIC bucket named 'pdfs' in your Supabase Dashboard.");
         }
         throw error;
      }

      setProgress(70);

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pdfs')
        .getPublicUrl(fileName);

      // 3. Save URL to Django Database
      await api.post('/upload/', {
        module: selectedModule,
        pdf_type: pdfType,
        file_url: publicUrl
      });

      setProgress(100);
      setStatus('success');
      setUploading(false);
      setTimeout(() => navigate(`/module/${selectedModule}`), 2000);
      
    } catch (err) {
      console.error("Upload failed:", err);
      // Detailed error message for the user if bucket is missing
      alert(err.message);
      setStatus('error');
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
          <UploadCloud size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Upload Resources
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Share your notes and question papers with others!
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Subject</label>
              <select 
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-shadow"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">Select a subject...</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Module</label>
              <select 
                required
                disabled={!selectedSubject}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-shadow disabled:opacity-50"
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
              >
                <option value="">Select a module...</option>
                {modules.map(m => (
                  <option key={m.id} value={m.id}>Module {m.module_number}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Resource Type</label>
            <div className="flex items-center gap-4 mt-2 justify-center md:justify-start">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="type" 
                  value="notes" 
                  checked={pdfType === 'notes'} 
                  onChange={(e) => setPdfType(e.target.value)}
                  className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-indigo-500 transition-colors">Notes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="type" 
                  value="question_paper" 
                  checked={pdfType === 'question_paper'} 
                  onChange={(e) => setPdfType(e.target.value)}
                  className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-purple-500 transition-colors">Question Paper</span>
              </label>
            </div>
          </div>

          <div className="pt-4">
            <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-indigo-200 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl bg-slate-50 dark:bg-slate-900/50 cursor-pointer transition-colors duration-300 group overflow-hidden">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center z-10">
                {file ? (
                  <>
                    <File className="w-10 h-10 text-indigo-500 mb-3" />
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-xs">{file.name}</p>
                    <p className="text-sm text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-12 h-12 text-slate-400 group-hover:text-indigo-500 transition-colors mb-3 group-hover:-translate-y-1 duration-300" />
                    <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">PDF documents only</p>
                  </>
                )}
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="application/pdf"
                onChange={handleFileChange}
                required
              />
              
              {uploading && (
                <div 
                  className="absolute bottom-0 left-0 bg-indigo-500/10 h-full transition-all duration-300 z-0"
                  style={{ width: `${progress}%` }}
                ></div>
              )}
            </label>
          </div>

          {status === 'error' && (
            <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>Error uploading. Ensure Firebase config is valid and backend is running.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center gap-3 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <p>Upload successful! Redirecting...</p>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !file || !selectedModule}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading {Math.round(progress)}%</span>
              </>
            ) : (
              <span>Upload Resource</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
