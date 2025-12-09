
import React, { useState } from 'react';
import { Job, INSTALLER_EMAILS } from '../types';
import { Plus, Save, LogOut, Briefcase, Users, Clock, CalendarRange, Trash2 } from 'lucide-react';

interface AdminDashboardProps {
  jobs: Job[];
  onAddJob: (job: Job) => void;
  onDeleteJob: (jobId: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ jobs, onAddJob, onDeleteJob, onLogout }) => {
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedInstallers, setSelectedInstallers] = useState<string[]>([]);

  const toggleInstaller = (email: string) => {
    setSelectedInstallers(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email) 
        : [...prev, email]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedInstallers.length === 0) {
      alert("Du måste välja minst en montör.");
      return;
    }

    if (endDate < startDate) {
      alert("Slutdatum kan inte vara före startdatum.");
      return;
    }

    const newJob: Job = {
      id: Date.now().toString(),
      customerName,
      address,
      contactPerson,
      phone,
      description,
      // Uses the raw value from datetime-local (e.g., 2024-05-20T08:00) replacing T with space for cleaner look
      startDate: startDate.replace('T', ' '), 
      endDate: endDate.replace('T', ' '),
      assignedInstallers: selectedInstallers,
      pdfFiles: [], // Mock: No file upload in this demo
      status: 'ACTIVE'
    };

    onAddJob(newJob);
    
    // Reset form
    setCustomerName('');
    setAddress('');
    setContactPerson('');
    setPhone('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setSelectedInstallers([]);
    setIsAdding(false);
  };

  const handleDeleteClick = (job: Job) => {
    // We use a simple confirm dialog. 
    // In a real app, a custom modal is often better, but this works for now.
    if (window.confirm(`Är du säker på att du vill ta bort arbetsordern för ${job.customerName}?`)) {
      onDeleteJob(job.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white px-6 py-8 rounded-b-[2rem] shadow-lg mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-slate-400 text-sm">Hantera arbetsordrar</p>
          </div>
          <button onClick={onLogout} className="text-slate-400 hover:text-white transition-colors">
            <LogOut size={20} />
          </button>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-blue-600/20 border border-blue-500/30 p-3 rounded-xl flex-1 backdrop-blur-sm">
             <p className="text-2xl font-bold text-white">{jobs.filter(j => j.status === 'ACTIVE').length}</p>
             <p className="text-xs text-blue-200">Aktiva jobb</p>
           </div>
           <button 
             onClick={() => setIsAdding(!isAdding)}
             className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl flex-1 flex flex-col items-center justify-center transition-colors shadow-lg shadow-blue-900/50"
           >
             <Plus size={24} className="mb-1" />
             <span className="text-xs font-bold">Nytt Jobb</span>
           </button>
        </div>
      </div>

      <div className="px-4 max-w-2xl mx-auto">
        {isAdding && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6 animate-in slide-in-from-top-4 fade-in duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus size={18} className="text-blue-600" />
              Skapa ny arbetsorder
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Kundnamn</label>
                  <input required value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Företag AB" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Adress</label>
                  <input required value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Gata 1, Stad" />
                </div>
                <div>
                   <label className="text-xs font-semibold text-slate-500 uppercase">Kontaktperson</label>
                   <input required value={contactPerson} onChange={e => setContactPerson(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Namn" />
                </div>
                <div>
                   <label className="text-xs font-semibold text-slate-500 uppercase">Telefon</label>
                   <input required value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="070..." />
                </div>
                <div className="col-span-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Starttid</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)} 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Sluttid</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)} 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                
                <div className="col-span-2">
                   <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Tilldela Montörer</label>
                   <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                     {INSTALLER_EMAILS.map(email => (
                       <label key={email} className="flex items-center gap-3 cursor-pointer p-1 hover:bg-slate-100 rounded">
                         <input 
                           type="checkbox" 
                           checked={selectedInstallers.includes(email)}
                           onChange={() => toggleInstaller(email)}
                           className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                         />
                         <span className="text-sm text-slate-700">{email}</span>
                       </label>
                     ))}
                   </div>
                </div>

                <div className="col-span-2">
                   <label className="text-xs font-semibold text-slate-500 uppercase">Jobbeskrivning</label>
                   <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none" placeholder="Beskriv jobbet och eventuella risker..." />
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">Avbryt</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2">
                  <Save size={18} />
                  Spara Jobb
                </button>
              </div>
            </form>
          </div>
        )}

        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3 pl-1">Befintliga jobb</h3>
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job.id} className={`bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-2 ${job.status === 'COMPLETED' ? 'opacity-70' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        {job.customerName}
                        {job.status === 'COMPLETED' && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">KLART</span>}
                    </h4>
                    <p className="text-sm text-slate-500">{job.address}</p>
                </div>
                <div className="flex items-center gap-2">
                     {/* Delete Button - Updated for Robustness */}
                     <button 
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteClick(job);
                        }}
                        className="bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 p-2 rounded-lg transition-colors cursor-pointer"
                        title="Ta bort jobb"
                     >
                        <Trash2 size={20} />
                     </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-2 mt-1">
                 <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{job.startDate}</span>
                 </div>
                 <div className="flex items-center gap-1">
                    <CalendarRange size={12} />
                    <span>{job.endDate.split(' ')[0]}</span>
                 </div>
                 <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>{job.assignedInstallers.length} montörer</span>
                 </div>
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <p className="text-center text-slate-400 py-8 italic">Inga jobb inlagda än.</p>
          )}
        </div>
      </div>
    </div>
  );
};
