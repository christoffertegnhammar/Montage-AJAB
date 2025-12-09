
import React, { useMemo } from 'react';
import { Job } from '../types';
import { ArrowLeft, FileText, Phone, User, MapPin, Briefcase, ClipboardCheck, Clock, Users, CalendarDays } from 'lucide-react';

interface JobDetailViewProps {
  job: Job;
  onBack: () => void;
  onStartRiskAnalysis: () => void;
}

export const JobDetailView: React.FC<JobDetailViewProps> = ({ job, onBack, onStartRiskAnalysis }) => {
  
  const durationDays = useMemo(() => {
    const start = new Date(job.startDate);
    const end = new Date(job.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days < 1 ? 1 : days;
  }, [job.startDate, job.endDate]);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-slate-200 px-4 py-3 flex items-center shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="ml-2 text-lg font-semibold text-slate-800">Jobbdetaljer</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Customer Info */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-3">Kundinformation</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mr-3">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900">{job.customerName}</p>
                <p className="text-sm text-slate-500">Kund</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mr-3">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900">{job.address}</p>
                <a 
                  href={`https://maps.google.com/?q=${job.address}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  Öppna karta
                </a>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mr-3">
                <User size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900">{job.contactPerson}</p>
                <p className="text-sm text-slate-500">Kontaktperson</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mr-3">
                <Phone size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900">{job.phone}</p>
                <a href={`tel:${job.phone}`} className="text-sm text-blue-600 underline">Ring upp</a>
              </div>
            </div>
          </div>
        </div>

        {/* Job Scope & Team */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
           <h2 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-3">Omfattning & Team</h2>
           
           <div className="flex items-center gap-3 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="bg-white p-2 rounded shadow-sm text-slate-500">
                <CalendarDays size={18} />
              </div>
              <div>
                 <p className="text-xs text-slate-500 uppercase font-bold">Tidsperiod</p>
                 <p className="text-sm font-medium text-slate-800">
                    {job.startDate} <span className="text-slate-400 mx-1">till</span> {job.endDate}
                 </p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-bold mb-1">
                   <Clock size={14} />
                   Varaktighet
                </div>
                <p className="text-slate-900 font-medium">ca {durationDays} dag(ar)</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-slate-500 text-xs uppercase font-bold mb-1">
                   <Users size={14} />
                   Team
                </div>
                <p className="text-slate-900 font-medium">{job.assignedInstallers.length} montörer</p>
              </div>
           </div>
           
           <div>
              <p className="text-xs text-slate-500 mb-2 font-medium">TILLDELADE MONTÖRER:</p>
              <div className="flex flex-wrap gap-2">
                 {job.assignedInstallers.map(email => (
                    <span key={email} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
                       {email}
                    </span>
                 ))}
              </div>
           </div>
        </div>

        {/* Job Description */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-3">Beskrivning</h2>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Attachments */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-3">Bifogade Filer</h2>
          {job.pdfFiles.length === 0 ? (
            <p className="text-slate-400 italic">Inga filer bifogade.</p>
          ) : (
            <div className="space-y-3">
              {job.pdfFiles.map((file) => (
                <div key={file.id} className="flex items-center p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => alert(`Öppnar ${file.name}... (Simulering)`)}>
                  <div className="bg-red-50 text-red-500 p-2 rounded mr-3">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{file.name}</p>
                    <p className="text-xs text-slate-500">{file.size}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button for Risk Analysis */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button 
          onClick={onStartRiskAnalysis}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
        >
          <ClipboardCheck size={20} />
          Starta Riskanalys
        </button>
      </div>
    </div>
  );
};
