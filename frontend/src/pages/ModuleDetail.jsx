import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Download, ChevronRight, Loader2, Calendar } from 'lucide-react';
import api from '../api';

export default function ModuleDetail() {
  const { id } = useParams();
  const [pdfs, setPdfs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get(`/modules/${id}/pdfs/`)
      .then(res => setPdfs(res.data))
      .catch(err => {
        console.error("Backend fallback", err);
        setPdfs([
          { id: 1, pdf_type: 'notes', file_url: '#', uploaded_at: new Date().toISOString() },
          { id: 2, pdf_type: 'question_paper', file_url: '#', uploaded_at: new Date().toISOString() }
        ]);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
      </div>
    );
  }

  const notes = pdfs.filter(p => p.pdf_type === 'notes');
  const qps = pdfs.filter(p => p.pdf_type === 'question_paper');

  const handlePdfClick = (e, fileUrl) => {
    if (fileUrl && fileUrl.startsWith('data:')) {
      e.preventDefault();
      try {
        const arr = fileUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], {type: mime});
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      } catch (err) {
        console.error("Error opening local PDF: ", err);
      }
    }
  };

  const renderPdfCard = (pdf, label, idx) => (
    <a
      key={pdf.id || idx}
      href={pdf.file_url}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => handlePdfClick(e, pdf.file_url)}
      className="group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-xl transition-all duration-300 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
          <FileText className="w-6 h-6 text-indigo-500 dark:text-indigo-400 group-hover:text-white transition-colors" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 dark:text-white text-lg">
            {label} {idx + 1}
          </h4>
          <div className="flex items-center gap-1 text-xs font-medium text-slate-400 mt-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(pdf.uploaded_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-slate-200 dark:border-slate-600 group-hover:border-transparent group-hover:text-indigo-500">
        <Download className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
      </div>
    </a>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <nav className="flex mb-8 text-sm font-medium text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
        <span className="text-slate-900 dark:text-white">Module {id}</span>
      </nav>

      <div className="mb-10 border-b border-slate-200 dark:border-slate-800 pb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          Module {id} Resources
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Access your notes and question papers sorted neatly for you.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Notes</h2>
            <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 py-1 px-3 rounded-full text-sm font-bold">
              {notes.length}
            </span>
          </div>
          
          {notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((pdf, idx) => renderPdfCard(pdf, "Module Notes", idx))}
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center">
              <p className="text-slate-500 dark:text-slate-400">No notes uploaded for this module yet.</p>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-purple-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Question Papers</h2>
            <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 py-1 px-3 rounded-full text-sm font-bold">
              {qps.length}
            </span>
          </div>
          
          {qps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {qps.map((pdf, idx) => renderPdfCard(pdf, "Question Paper", idx))}
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center">
              <p className="text-slate-500 dark:text-slate-400">No question papers uploaded yet.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
