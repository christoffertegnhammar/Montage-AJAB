import React, { useState } from 'react';
import { Job, User, SelfCheckItem, SELF_CHECK_ITEMS_CONST } from '../types';
import { ArrowLeft, CheckCircle2, XCircle, FileDown, Loader2, UserCheck } from 'lucide-react';

interface SelfCheckFormProps {
  job: Job;
  user: User;
  onBack: () => void;
  onSubmit: (items: SelfCheckItem[], generalComment: string, email: string) => void;
}

export const SelfCheckForm: React.FC<SelfCheckFormProps> = ({ job, user, onBack, onSubmit }) => {
  const [items, setItems] = useState<SelfCheckItem[]>(
    SELF_CHECK_ITEMS_CONST.map((label, index) => ({
      id: index.toString(),
      label,
      status: 'OK'
    }))
  );
  const [generalComment, setGeneralComment] = useState('');
  const [email, setEmail] = useState('anna@ajabs.se');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = (id: string, status: 'OK' | 'EJ_OK') => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };

  const handleCommentChange = (id: string, comment: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, comment } : item
    ));
  };

  const handleFinish = () => {
    setIsSubmitting(true);
    // Simulate slight delay for UX
    setTimeout(() => {
        onSubmit(items, generalComment, email);
        setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      <div className="bg-white sticky top-0 z-10 border-b border-slate-200 px-4 py-3 flex items-center shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <div className="ml-2">
          <h1 className="text-lg font-semibold text-slate-800">Egenkontroll</h1>
          <p className="text-xs text-slate-500">{job.customerName}</p>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        
        {/* User Badge */}
        <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-1.5 rounded-full text-slate-500">
                    <UserCheck size={16} />
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Utfärdas av</p>
                    <p className="text-sm font-medium text-slate-900">{user.email}</p>
                </div>
            </div>
        </div>

        {/* Checklist */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {items.map((item) => (
                <div key={item.id} className="p-4">
                    <p className="font-medium text-slate-800 mb-3">{item.label}</p>
                    
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleStatusChange(item.id, 'OK')}
                            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 border transition-colors ${
                                item.status === 'OK' 
                                ? 'bg-green-100 border-green-200 text-green-700' 
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                            }`}
                        >
                            <CheckCircle2 size={18} />
                            <span className="font-bold text-sm">OK</span>
                        </button>
                        <button
                            onClick={() => handleStatusChange(item.id, 'EJ_OK')}
                            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 border transition-colors ${
                                item.status === 'EJ_OK' 
                                ? 'bg-red-100 border-red-200 text-red-700' 
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                            }`}
                        >
                            <XCircle size={18} />
                            <span className="font-bold text-sm">Ej OK</span>
                        </button>
                    </div>

                    {item.status === 'EJ_OK' && (
                        <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs text-red-600 font-semibold uppercase">Ange avvikelse / Åtgärd</label>
                            <input
                                type="text"
                                value={item.comment || ''}
                                onChange={(e) => handleCommentChange(item.id, e.target.value)}
                                placeholder="Beskriv vad som är fel..."
                                className="w-full mt-1 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-900 placeholder-red-300 focus:outline-none focus:ring-1 focus:ring-red-500"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* General Comments */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-3">Övriga kommentarer</h2>
            <textarea
                value={generalComment}
                onChange={(e) => setGeneralComment(e.target.value)}
                placeholder="Skriv eventuella övriga noteringar här..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
            />
        </div>

         {/* Email Settings */}
         <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-3">Rapportering</h2>
            <div className="space-y-2">
                <label className="text-xs text-slate-500">Mottagare (Kontoret)</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button 
          onClick={handleFinish}
          disabled={isSubmitting}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors ${isSubmitting ? 'opacity-80' : ''}`}
        >
          {isSubmitting ? (
             <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
                <FileDown size={20} />
                Slutför & Ladda ner PDF:er
            </>
          )}
        </button>
      </div>
    </div>
  );
};
