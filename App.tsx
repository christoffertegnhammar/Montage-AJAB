
import React, { useState, useMemo, useEffect } from 'react';
import { Job, AppView, User, RiskItem, RiskAnalysisData, SelfCheckItem } from './types';
import { JobCard } from './components/JobCard';
import { JobDetailView } from './components/JobDetailView';
import { RiskAnalysisForm } from './components/RiskAnalysisForm';
import { SelfCheckForm } from './components/SelfCheckForm';
import { LoginView } from './components/LoginView';
import { AdminDashboard } from './components/AdminDashboard';
import { LayoutGrid, LogOut, CheckCircle } from 'lucide-react';
import { generateRiskPDF, generateSelfCheckPDF } from './services/pdfService';

// Initial Mock Data - Empty as requested
const INITIAL_JOBS: Job[] = [];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // Dashboard State
  const [dashboardTab, setDashboardTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');
  
  // Temporary storage for risk data when moving between steps
  const [tempRiskData, setTempRiskData] = useState<{risks: RiskItem[], notes: string} | null>(null);

  // Auto-cleanup old completed jobs (older than 1 year)
  useEffect(() => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    setJobs(prevJobs => prevJobs.filter(job => {
      if (job.status === 'COMPLETED' && job.completedAt) {
        const completedDate = new Date(job.completedAt);
        return completedDate > oneYearAgo;
      }
      return true;
    }));
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'ADMIN') {
      setCurrentView(AppView.ADMIN_DASHBOARD);
    } else {
      setCurrentView(AppView.JOB_LIST);
      setDashboardTab('ACTIVE');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(AppView.LOGIN);
    setSelectedJob(null);
    setTempRiskData(null);
  };

  const handleAddJob = (newJob: Job) => {
    setJobs(prev => [newJob, ...prev]);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const handleJobSelect = (job: Job) => {
    // Prevent modification of completed jobs if needed, or allow read-only
    setSelectedJob(job);
    setCurrentView(AppView.JOB_DETAILS);
  };

  const handleBackToHome = () => {
    setCurrentView(AppView.JOB_LIST);
    setSelectedJob(null);
    setTempRiskData(null);
  };

  const handleBackToDetails = () => {
    setCurrentView(AppView.JOB_DETAILS);
    setTempRiskData(null);
  };

  const handleStartAnalysis = () => {
    setCurrentView(AppView.RISK_ANALYSIS);
  };

  // STEP 1 FINISHED -> GO TO STEP 2
  const handleRiskNext = (risks: RiskItem[], notes: string) => {
    setTempRiskData({ risks, notes });
    setCurrentView(AppView.SELF_CHECK);
  };

  // BACK FROM STEP 2 -> STEP 1
  const handleBackToRisk = () => {
    setCurrentView(AppView.RISK_ANALYSIS);
  };

  // STEP 2 FINISHED -> GENERATE EVERYTHING & COMPLETE JOB
  const handleSelfCheckSubmit = (items: SelfCheckItem[], generalComment: string, email: string) => {
    if (!selectedJob || !currentUser || !tempRiskData) return;

    // 1. Generate Risk PDF
    try {
        generateRiskPDF(selectedJob, currentUser, tempRiskData.risks, tempRiskData.notes);
    } catch (e) {
        console.error("Failed to generate Risk PDF", e);
    }

    // 2. Generate Self Check PDF
    setTimeout(() => {
        try {
            generateSelfCheckPDF(selectedJob, currentUser, items, generalComment);
        } catch (e) {
            console.error("Failed to generate Self Check PDF", e);
        }
    }, 500);

    // 3. Mark Job as Completed
    setJobs(prevJobs => prevJobs.map(j => 
      j.id === selectedJob.id 
        ? { ...j, status: 'COMPLETED', completedAt: new Date().toISOString() }
        : j
    ));

    // 4. Open Email
    setTimeout(() => {
        const subject = encodeURIComponent(`Arbetsrapporter: ${selectedJob.customerName}`);
        const body = encodeURIComponent(
            `Hej,\n\nHär kommer dokumentation för utfört arbete på ${selectedJob.address}.\n\n` +
            `Montör: ${currentUser.email}\n` +
            `Datum: ${new Date().toLocaleDateString()}\n\n` +
            `Bifogade filer:\n1. Riskanalys\n2. Egenkontroll\n\n` +
            `Mvh,\n${currentUser.email.split('@')[0]}`
        );
        
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        
        alert(`Klart! \nTvå PDF-filer har laddats ner till din enhet.\nJobbet har flyttats till "Avslutade".`);
        
        handleBackToHome();
    }, 1500);
  };

  // Filter Jobs for the logged-in installer based on active tab
  const displayedJobs = useMemo(() => {
    if (!currentUser || currentUser.role === 'ADMIN') return [];
    
    return jobs
      .filter(job => 
        job.assignedInstallers.includes(currentUser.email) && 
        job.status === dashboardTab
      )
      .sort((a, b) => {
         // Sort Active by Start Date (ascending), Completed by CompletedAt (descending)
         if (dashboardTab === 'ACTIVE') return a.startDate.localeCompare(b.startDate);
         return (b.completedAt || b.startDate).localeCompare(a.completedAt || a.startDate);
      });
  }, [jobs, currentUser, dashboardTab]);

  const activeCount = useMemo(() => {
     if (!currentUser) return 0;
     return jobs.filter(j => j.assignedInstallers.includes(currentUser.email) && j.status === 'ACTIVE').length;
  }, [jobs, currentUser]);

  const completedCount = useMemo(() => {
    if (!currentUser) return 0;
    return jobs.filter(j => j.assignedInstallers.includes(currentUser.email) && j.status === 'COMPLETED').length;
 }, [jobs, currentUser]);

  // 1. Login View
  if (currentView === AppView.LOGIN) {
    return <LoginView onLogin={handleLogin} />;
  }

  // 2. Admin View
  if (currentView === AppView.ADMIN_DASHBOARD && currentUser?.role === 'ADMIN') {
    return (
      <AdminDashboard 
        jobs={jobs} 
        onAddJob={handleAddJob} 
        onDeleteJob={handleDeleteJob}
        onLogout={handleLogout} 
      />
    );
  }

  // 3. Main App Container (Installer Views)
  return (
    <div className="max-w-md mx-auto bg-slate-100 min-h-screen shadow-2xl overflow-hidden relative">
      
      {currentView === AppView.JOB_LIST && (
        <div className="pb-20">
          {/* Main Dashboard Header */}
          <div className="bg-slate-900 text-white p-6 pt-12 rounded-b-[2.5rem] shadow-lg mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Montör</p>
                <h1 className="text-xl font-bold truncate max-w-[200px]">{currentUser?.email}</h1>
              </div>
              <button onClick={handleLogout} className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition-colors">
                <LogOut size={20} className="text-slate-300" />
              </button>
            </div>
            
            <div className="flex gap-4">
               <button 
                onClick={() => setDashboardTab('ACTIVE')}
                className={`flex-1 p-3 rounded-xl backdrop-blur-sm border transition-all ${
                  dashboardTab === 'ACTIVE' 
                    ? 'bg-blue-600/20 border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                    : 'bg-slate-800/50 border-slate-700 opacity-60 hover:opacity-100'
                }`}
               >
                 <p className={`text-2xl font-bold ${dashboardTab === 'ACTIVE' ? 'text-white' : 'text-slate-300'}`}>
                    {activeCount}
                 </p>
                 <p className={`text-xs ${dashboardTab === 'ACTIVE' ? 'text-blue-200' : 'text-slate-400'}`}>
                    Mina jobb
                 </p>
               </button>

               <button 
                onClick={() => setDashboardTab('COMPLETED')}
                className={`flex-1 p-3 rounded-xl backdrop-blur-sm border transition-all ${
                  dashboardTab === 'COMPLETED' 
                    ? 'bg-emerald-600/20 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                    : 'bg-slate-800/50 border-slate-700 opacity-60 hover:opacity-100'
                }`}
               >
                 <p className={`text-2xl font-bold ${dashboardTab === 'COMPLETED' ? 'text-white' : 'text-slate-300'}`}>
                    {completedCount}
                 </p>
                 <p className={`text-xs ${dashboardTab === 'COMPLETED' ? 'text-emerald-200' : 'text-slate-400'}`}>
                    Klara
                 </p>
               </button>
            </div>
          </div>

          <div className="px-4">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              {dashboardTab === 'ACTIVE' ? (
                 <LayoutGrid size={18} className="text-slate-500" />
              ) : (
                 <CheckCircle size={18} className="text-emerald-500" />
              )}
              {dashboardTab === 'ACTIVE' ? 'Mina Arbetsordrar' : 'Avslutade Jobb'}
            </h2>
            
            {displayedJobs.length > 0 ? (
              displayedJobs.map(job => (
                <div key={job.id} className={dashboardTab === 'COMPLETED' ? 'opacity-75 grayscale-[0.5]' : ''}>
                    <JobCard job={job} onClick={handleJobSelect} />
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                  <p className="text-slate-500 italic">
                    {dashboardTab === 'ACTIVE' ? "Inga aktiva jobb." : "Inga avslutade jobb än."}
                  </p>
              </div>
            )}

            {dashboardTab === 'COMPLETED' && displayedJobs.length > 0 && (
                <p className="text-xs text-center text-slate-400 mt-4 italic">
                    Avslutade jobb sparas lokalt i 1 år.
                </p>
            )}
          </div>
        </div>
      )}

      {currentView === AppView.JOB_DETAILS && selectedJob && (
        <JobDetailView 
          job={selectedJob} 
          onBack={handleBackToHome} 
          onStartRiskAnalysis={handleStartAnalysis} 
        />
      )}

      {currentView === AppView.RISK_ANALYSIS && selectedJob && currentUser && (
        <RiskAnalysisForm 
          job={selectedJob} 
          user={currentUser}
          onBack={handleBackToDetails} 
          onNext={handleRiskNext} 
        />
      )}

      {currentView === AppView.SELF_CHECK && selectedJob && currentUser && (
        <SelfCheckForm
            job={selectedJob}
            user={currentUser}
            onBack={handleBackToRisk}
            onSubmit={handleSelfCheckSubmit}
        />
      )}

    </div>
  );
};

export default App;
