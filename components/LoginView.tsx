import React, { useState } from 'react';
import { User, ADMIN_EMAILS, INSTALLER_EMAILS } from '../types';
import { ShieldCheck, ArrowRight, UserCheck, KeyRound } from 'lucide-react';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail.includes('@')) {
      setError('Vänligen ange en giltig e-postadress.');
      return;
    }

    let role: 'ADMIN' | 'INSTALLER' = 'INSTALLER'; // Default role

    if (ADMIN_EMAILS.includes(normalizedEmail)) {
      role = 'ADMIN';
    } else if (INSTALLER_EMAILS.includes(normalizedEmail)) {
      role = 'INSTALLER';
    } else {
      // Fallback logic for testing or unknown emails
      if (normalizedEmail.includes('admin')) {
        role = 'ADMIN';
      }
    }
    
    onLogin({
      email: normalizedEmail,
      role
    });
  };

  const handleQuickFill = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-500/30">
            <ShieldCheck size={48} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2">Portmontage AJAB</h1>
        <p className="text-slate-400 text-center mb-8">Logga in för att hantera jobb och riskbedömningar.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">E-postadress</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="namn@ajabs.se"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {error && <p className="text-red-400 text-xs mt-2 ml-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            Logga in
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Quick User List for easy access/demo */}
        <div className="mt-10 pt-6 border-t border-slate-800">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">Tillgängliga användare</p>
          
          <div className="grid gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-blue-400 mb-1">
                <KeyRound size={12} /> <span>Administratörer</span>
              </div>
              {ADMIN_EMAILS.slice(0, 2).map(mail => (
                <button 
                  key={mail} 
                  onClick={() => handleQuickFill(mail)}
                  className="w-full text-left px-3 py-2 rounded bg-slate-800/50 hover:bg-slate-800 text-xs text-slate-300 transition-colors"
                >
                  {mail}
                </button>
              ))}
            </div>

            <div className="space-y-1 mt-2">
              <div className="flex items-center gap-2 text-xs text-green-400 mb-1">
                <UserCheck size={12} /> <span>Montörer</span>
              </div>
              {INSTALLER_EMAILS.map(mail => (
                <button 
                  key={mail} 
                  onClick={() => handleQuickFill(mail)}
                  className="w-full text-left px-3 py-2 rounded bg-slate-800/50 hover:bg-slate-800 text-xs text-slate-300 transition-colors"
                >
                  {mail}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};