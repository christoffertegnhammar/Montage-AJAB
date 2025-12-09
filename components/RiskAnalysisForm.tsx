
import React, { useState, useEffect } from 'react';
import { Job, RiskItem, User } from '../types';
import { ArrowLeft, CheckCircle2, AlertTriangle, Sparkles, Loader2, ChevronDown, ChevronUp, UserCheck, ArrowRight } from 'lucide-react';
import { generateRiskSuggestions } from '../services/geminiService';

interface RiskAnalysisFormProps {
  job: Job;
  user: User;
  onBack: () => void;
  // Modified callback: Passes data instead of handling email directly
  onNext: (risks: RiskItem[], notes: string) => void;
}

// Data definitions from the PDF
const PHYSICAL_RISKS: RiskItem[] = [
  { id: '1', category: 'Fysiska risker', hazard: 'Fallrisk mer än 2 meter (Lift, stege, montering)', measure: 'Lift: Endast utbildad personal. Besiktigad lift. Avspärrning. Fallsäkring vid behov.', riskLevel: 'H', checked: true },
  { id: '2', category: 'Fysiska risker', hazard: 'Fallrisk – låg höjd under 2 meter', measure: 'Använd hela och typgodkända arbetsbockar/stegar. Blanda inte modeller.', riskLevel: 'M', checked: true },
  { id: '3', category: 'Fysiska risker', hazard: 'Fallrisk – Fallskyddsutrustning (Bli hängande)', measure: 'Gör alltid riskbedömning med räddningsplan innan arbete. Ensmarbete förbjudet med fallskydd.', riskLevel: 'H', checked: true },
  { id: '4', category: 'Fysiska risker', hazard: 'Risk för bullerskador', measure: 'Hörselskydd ska användas.', riskLevel: 'M', checked: true },
  { id: '5', category: 'Fysiska risker', hazard: 'Risk för ögonstänk (Svets, såg, slip)', measure: 'Lämpliga skyddsglasögon skall användas. Se till att de är hela.', riskLevel: 'M', checked: true },
  { id: '6', category: 'Fysiska risker', hazard: 'Allmän risk på arbetsplatser (Påkörning, kläm)', measure: 'Använd varselkläder, skyddsskor, hjälm och glasögon. Följ kundens regler.', riskLevel: 'H', checked: true },
  { id: '7', category: 'Fysiska risker', hazard: 'Risk maskiner (Klämskada, skärskada)', measure: 'Rätt maskin till rätt moment. Medvetenhet om risker. Skyddsutrustning på plats.', riskLevel: 'L', checked: true },
  { id: '8', category: 'Fysiska risker', hazard: 'Risk för skärskador (Vassa kanter, plåt)', measure: 'Skyddshandskar skall användas samt rätt övrig skyddsutrustning.', riskLevel: 'L', checked: true },
  { id: '9', category: 'Fysiska risker', hazard: 'Svetsblänk vid svets', measure: 'Alltid använda rätt skyddsutrustning som skyddsvisir. God ventilation.', riskLevel: 'L', checked: true },
  { id: '10', category: 'Fysiska risker', hazard: 'El / Strömgenomgång', measure: 'Kontrollera att inga kablar finns i vägg/tak. Använd godkänd byggström. Jordfelsbrytare.', riskLevel: 'L', checked: true },
  { id: '11', category: 'Fysiska risker', hazard: 'Snubbelolyckor (Material, sladdar)', measure: 'Ordning och reda. Ansvar för eget material/emballage.', riskLevel: 'L', checked: true },
  { id: '12', category: 'Fysiska risker', hazard: 'Fallande föremål (Kran, travers, truck)', measure: 'Gå aldrig under hängande last. Ta ned utrustning från maskiner.', riskLevel: 'M', checked: true },
  { id: '13', category: 'Fysiska risker', hazard: 'Exponering av damm (Kvarts, metall)', measure: 'Använd mask (P3-filter) vid behov. Använd dammsugare.', riskLevel: 'L', checked: true },
  { id: '14', category: 'Fysiska risker', hazard: 'Exponering kemikalier (Färg, zink, silikon)', measure: 'Läs säkerhetsdatablad. Rätt skyddsutrustning.', riskLevel: 'L', checked: true },
  { id: '15', category: 'Fysiska risker', hazard: 'Olyckor vid arbete på företag/industri', measure: 'Skaffa kännedom om lokala regler/arbetsmiljöplan. Gör riskbedömning vid tveksamhet.', riskLevel: 'M', checked: true },
  { id: '16', category: 'Fysiska risker', hazard: 'Truckkörning', measure: 'Endast utbildad personal med tillstånd. Följ rutiner.', riskLevel: 'L', checked: true },
  { id: '17', category: 'Fysiska risker', hazard: 'Klämskador vid truckarbete', measure: 'Iaktta försiktighet. Använd skyddsskor. Stressa inte.', riskLevel: 'L', checked: true },
  { id: '18', category: 'Fysiska risker', hazard: 'Risk för trafikolycka', measure: 'Se trafiksäkerhetspolicy. Följ trafikregler.', riskLevel: 'M', checked: true },
  { id: '19', category: 'Fysiska risker', hazard: 'Risker vid ensamarbete', measure: 'Undvik i möjligaste mån. Kontrollrutiner. Telefon tillgänglig. Ladda ner 112 app.', riskLevel: 'L', checked: true },
  { id: '20', category: 'Fysiska risker', hazard: 'Halkrisker, utomhus', measure: 'Ta det försiktigt vid dåligt underlag, anpassa arbetstakten.', riskLevel: 'L', checked: true },
  { id: '21', category: 'Fysiska risker', hazard: 'Risk för brand/brännskada (Heta arbeten)', measure: 'Följ regler för heta arbeten. Brandvakt vid behov. Släckutrustning i bil.', riskLevel: 'M', checked: true },
  { id: '22', category: 'Fysiska risker', hazard: 'Vibrationsskador', measure: 'Var uppmärksam på domningar. Pausa, byt moment. Använd poängmetod vid osäkerhet.', riskLevel: 'L', checked: true },
];

const ERGO_RISKS: RiskItem[] = [
  { id: '23', category: 'Belastningsergonomi', hazard: 'Belastningsskador (Tunga lyft)', measure: 'Använd lyfthjälpmedel! Rak rygg, lyft med benen. Undvik vridning.', riskLevel: 'M', checked: true },
  { id: '24', category: 'Belastningsergonomi', hazard: 'Arbete över axelhöjd', measure: 'Använd lift/bock för rätt höjd. Variera arbetet, ta pauser.', riskLevel: 'M', checked: true },
  { id: '25', category: 'Belastningsergonomi', hazard: 'Ergonomiskt belastande ställningar (Knä/Sned)', measure: 'Använd knäskydd. Planera arbetet.', riskLevel: 'L', checked: true },
  { id: '26', category: 'Belastningsergonomi', hazard: 'Arbete från stege', measure: 'Kortare stunder. Enhandsfattning. Undvik att sträcka dig.', riskLevel: 'L', checked: true },
  { id: '27', category: 'Belastningsergonomi', hazard: 'Förslitningsskador', measure: 'Undvik obekväma ställningar. Egen träning motverkar skador.', riskLevel: 'M', checked: true },
];

const SOCIAL_RISKS: RiskItem[] = [
  { id: '28', category: 'Organisatoriska/Sociala', hazard: 'Ohälsosam arbetsbelastning', measure: 'Diskutera med arbetsledning. Åta dig inte mer än vad som går.', riskLevel: 'L', checked: true },
  { id: '29', category: 'Organisatoriska/Sociala', hazard: 'Konflikter och kränkningar', measure: 'Följ policy kring kränkande särbehandling.', riskLevel: 'L', checked: true },
  { id: '30', category: 'Organisatoriska/Sociala', hazard: 'Stressrelaterade symtom', measure: 'Ta pauser. Variera moment. Kontakta ledning vid symptom.', riskLevel: 'L', checked: true },
  { id: '31', category: 'Organisatoriska/Sociala', hazard: 'Ohälsa', measure: 'Medarbetarsamtal. Daglig dialog.', riskLevel: 'L', checked: true },
];

const OTHER_RISKS: RiskItem[] = [
  { id: '32', category: 'Övriga risker', hazard: 'Risker som ej är riskbedömda', measure: 'Absolut förbjudet att påbörja moment som ej är riskbedömt!', riskLevel: 'L', checked: true },
  { id: '33', category: 'Övriga risker', hazard: 'Risker som ej är riskbedömda (Dokumentation)', measure: 'Gör alltid skriftlig riskbedömning innan start. Kontakta chef vid allvarlig risk.', riskLevel: 'L', checked: true },
];

const INITIAL_RISKS = [...PHYSICAL_RISKS, ...ERGO_RISKS, ...SOCIAL_RISKS, ...OTHER_RISKS];

const getRiskColor = (level?: 'L' | 'M' | 'H') => {
  switch (level) {
    case 'H': return 'bg-red-100 text-red-700 border-red-200';
    case 'M': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'L': return 'bg-green-100 text-green-700 border-green-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const getRiskLabel = (level?: 'L' | 'M' | 'H') => {
  switch (level) {
    case 'H': return 'Hög Risk';
    case 'M': return 'Medel Risk';
    case 'L': return 'Låg Risk';
    default: return '';
  }
};

export const RiskAnalysisForm: React.FC<RiskAnalysisFormProps> = ({ job, user, onBack, onNext }) => {
  const [risks, setRisks] = useState<RiskItem[]>(INITIAL_RISKS);
  const [loadingAi, setLoadingAi] = useState(false);
  const [notes, setNotes] = useState('');
  const [aiSuggestionsAdded, setAiSuggestionsAdded] = useState(false);
  
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'Fysiska risker': false,
    'Belastningsergonomi': true, 
    'Organisatoriska/Sociala': true,
    'Övriga risker': true,
    'AI Förslag': false
  });

  useEffect(() => {
    const loadAiRisks = async () => {
      if (aiSuggestionsAdded) return;
      
      setLoadingAi(true);
      const suggestions = await generateRiskSuggestions(job);
      if (suggestions.length > 0) {
        setRisks(prev => [...prev, ...suggestions]);
        setAiSuggestionsAdded(true);
      }
      setLoadingAi(false);
    };

    loadAiRisks();
  }, [job]);

  const toggleRisk = (id: string) => {
    setRisks(prev => prev.map(r => r.id === id ? { ...r, checked: !r.checked } : r));
  };

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleNext = () => {
    onNext(risks, notes);
  };

  const groupedRisks: Record<string, RiskItem[]> = {
    'Fysiska risker': risks.filter(r => r.category === 'Fysiska risker' && !r.isAiSuggested),
    'Belastningsergonomi': risks.filter(r => r.category === 'Belastningsergonomi' && !r.isAiSuggested),
    'Organisatoriska/Sociala': risks.filter(r => r.category === 'Organisatoriska/Sociala' && !r.isAiSuggested),
    'Övriga risker': risks.filter(r => r.category === 'Övriga risker' && !r.isAiSuggested),
    'AI Förslag': risks.filter(r => r.isAiSuggested),
  };

  const sectionsToShow = Object.keys(groupedRisks).filter(key => key !== 'AI Förslag' || groupedRisks[key].length > 0);

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      <div className="bg-white sticky top-0 z-10 border-b border-slate-200 px-4 py-3 flex items-center shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <div className="ml-2">
          <h1 className="text-lg font-semibold text-slate-800">Riskanalys</h1>
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
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                Steg 1 av 2
            </span>
        </div>

        {/* AI Info Banner */}
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-3">
          <div className="bg-white p-2 rounded-full h-fit shadow-sm">
            {loadingAi ? (
              <Loader2 className="animate-spin text-indigo-600" size={20} />
            ) : (
              <Sparkles className="text-indigo-600" size={20} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-indigo-900 text-sm">
              {loadingAi ? "Analyserar jobbet..." : "AI-Assisterad Analys"}
            </h3>
            <p className="text-indigo-700 text-xs mt-1">
              {loadingAi 
                ? "Letar efter specifika risker för just detta jobb..." 
                : "Listan har kompletterats automatiskt baserat på arbetsordern."}
            </p>
          </div>
        </div>

        {/* Risk Checklist Sections */}
        <div className="space-y-4">
          {sectionsToShow.map(sectionTitle => {
            const sectionRisks = groupedRisks[sectionTitle];
            if (sectionRisks.length === 0) return null;
            const isCollapsed = collapsedSections[sectionTitle];

            return (
              <div key={sectionTitle} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <button 
                  onClick={() => toggleSection(sectionTitle)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                      {sectionTitle}
                    </h2>
                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {sectionRisks.length}
                    </span>
                  </div>
                  {isCollapsed ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronUp size={20} className="text-slate-400" />}
                </button>

                {!isCollapsed && (
                  <div className="divide-y divide-slate-100">
                    {sectionRisks.map((risk) => (
                      <label 
                        key={risk.id} 
                        className={`block p-4 cursor-pointer transition-all hover:bg-slate-50 ${
                          !risk.checked ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 min-w-[24px] h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                            risk.checked ? 'bg-green-500 border-green-500' : 'border-slate-300 bg-white'
                          }`}>
                            {risk.checked && <CheckCircle2 size={16} className="text-white" />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="font-semibold text-slate-800 text-sm">{risk.hazard}</span>
                                {risk.riskLevel && (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wider ${getRiskColor(risk.riskLevel)}`}>
                                    {getRiskLabel(risk.riskLevel)}
                                  </span>
                                )}
                                {risk.isAiSuggested && (
                                    <span className="bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                        AI
                                    </span>
                                )}
                            </div>
                            
                            <div className="text-xs text-slate-600 flex gap-1.5 items-start mt-1">
                                <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                                <span className="italic leading-tight">{risk.measure}</span>
                            </div>
                          </div>

                          <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={risk.checked} 
                            onChange={() => toggleRisk(risk.id)} 
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Notes */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-3">Egna noteringar</h2>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Övriga risker eller kommentarer..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
            />
        </div>

      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button 
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
        >
            <span>Vidare till Egenkontroll</span>
            <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
