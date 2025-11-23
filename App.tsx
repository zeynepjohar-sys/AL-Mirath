import React, { useState, useEffect } from 'react';
import { HeirType, HeirInput, CalculationResult, CurrencyCode } from './types';
import { calculateInheritance } from './services/geminiService';
import { HeirInputRow } from './components/HeirInputRow';
import { ResultsView } from './components/ResultsView';
import { InheritanceRules } from './components/InheritanceRules';
import { Language, UI_TEXT, HEIR_NAMES } from './utils/translations';
import { Calculator, Wallet, Users, ChevronRight, ChevronLeft, Loader2, Globe, Check, Moon, Sun } from 'lucide-react';

const AVAILABLE_HEIRS = Object.values(HeirType);

const CURRENCY_OPTIONS: { code: CurrencyCode; symbol: string; name: string }[] = [
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
];

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>('EGP');
  const [estateValue, setEstateValue] = useState<string>('');
  const [selectedHeirs, setSelectedHeirs] = useState<HeirInput[]>([]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = UI_TEXT[language];
  const selectedCurrency = CURRENCY_OPTIONS.find(c => c.code === currency) || CURRENCY_OPTIONS[0];

  // Handle document direction and title change
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.title = t.title;
  }, [language, t]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const addHeir = (type: HeirType) => {
    const existing = selectedHeirs.find(h => h.type === type);
    if (existing) return; // Already added

    // Mutual exclusivity check for Husband/Wife
    if (type === HeirType.HUSBAND && selectedHeirs.some(h => h.type === HeirType.WIFE)) {
      alert(t.husbandWifeConflict);
      return;
    }
    if (type === HeirType.WIFE && selectedHeirs.some(h => h.type === HeirType.HUSBAND)) {
      alert(t.husbandWifeConflict);
      return;
    }

    setSelectedHeirs([...selectedHeirs, { type, count: 1 }]);
  };

  const updateHeirCount = (type: HeirType, count: number) => {
    setSelectedHeirs(prev => prev.map(h => h.type === type ? { ...h, count } : h));
  };

  const removeHeir = (type: HeirType) => {
    setSelectedHeirs(prev => prev.filter(h => h.type !== type));
  };

  const isHeirSelected = (type: HeirType) => selectedHeirs.some(h => h.type === type);
  
  const isHeirDisabled = (type: HeirType) => {
    if (isHeirSelected(type)) return true;
    if (type === HeirType.HUSBAND && isHeirSelected(HeirType.WIFE)) return true;
    if (type === HeirType.WIFE && isHeirSelected(HeirType.HUSBAND)) return true;
    return false;
  };

  const handleCalculate = async () => {
    setError(null);
    const numericEstate = parseFloat(estateValue.replace(/,/g, ''));

    if (isNaN(numericEstate) || numericEstate <= 0) {
      setError(t.errorEstate);
      return;
    }

    if (selectedHeirs.length === 0) {
      setError(t.errorHeir);
      return;
    }

    setLoading(true);
    try {
      const data = await calculateInheritance(numericEstate, selectedHeirs, language);
      setResult(data);
    } catch (err: any) {
        console.error(err);
        // Fallback friendly error message
        let msg = t.errorApi;
        if (err.message?.includes("API Key")) msg = t.apiKeyError;
        setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-gray-100 pb-20 font-sans flex flex-col transition-colors duration-300`}>
        {/* Header */}
        <header className="bg-emerald-900 dark:bg-emerald-950 text-white py-8 shadow-lg transition-colors duration-300">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Calculator className="text-emerald-300" size={32} />
                  <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
                </div>
                <p className="text-emerald-100 max-w-2xl opacity-90">
                  {t.description}
                </p>
              </div>
              
              <div className="flex items-center gap-3 self-start md:self-center">
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-900 dark:hover:bg-emerald-800 transition-colors border border-emerald-700 dark:border-emerald-800"
                  aria-label="Toggle Dark Mode"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 dark:bg-emerald-900 dark:hover:bg-emerald-800 px-4 py-2 rounded-lg transition-colors text-sm font-medium border border-emerald-700 dark:border-emerald-800"
                >
                  <Globe size={18} />
                  {language === 'en' ? 'العربية' : 'English'}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 -mt-6 space-y-8 flex-grow w-full relative z-10">
          
          {!result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {/* Estate Value Card */}
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-slate-100 dark:border-gray-800 transition-colors duration-300">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                          <div className="flex items-center gap-2 text-slate-800 dark:text-gray-100">
                              <Wallet className="text-emerald-600 dark:text-emerald-500" size={20} />
                              <h2 className="text-lg font-semibold">{t.totalEstate}</h2>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-50 dark:bg-gray-800 p-1 rounded-lg border border-slate-200 dark:border-gray-700">
                              <label htmlFor="currency" className="text-sm text-slate-500 dark:text-gray-400 font-medium px-2">{t.currency}</label>
                              <select 
                                  id="currency"
                                  value={currency}
                                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                                  className="bg-white dark:bg-gray-700 text-sm text-slate-800 dark:text-white font-semibold py-1.5 pl-2 pr-8 rounded-md border-none focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                              >
                                  {CURRENCY_OPTIONS.map(c => (
                                      <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                                  ))}
                              </select>
                          </div>
                      </div>
                      <div>
                          <label htmlFor="estate" className="sr-only">Amount</label>
                          <div className="relative">
                              <span className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 font-semibold select-none z-10`}>
                                  {selectedCurrency.symbol}
                              </span>
                              <input 
                                  id="estate"
                                  type="number" 
                                  placeholder={t.estatePlaceholder}
                                  value={estateValue}
                                  onChange={(e) => setEstateValue(e.target.value)}
                                  className={`w-full ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 rounded-lg border border-slate-700 dark:border-gray-600 bg-slate-900 dark:bg-black text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-900 outline-none transition-all text-lg font-medium placeholder-slate-500 dark:placeholder-gray-600 shadow-inner`}
                                  dir="ltr" /* Keep number input LTR for alignment consistency with currency */
                              />
                          </div>
                          <p className="text-xs text-slate-500 dark:text-gray-400 mt-2 mx-1">{t.estateHint}</p>
                      </div>
                  </div>

                  {/* Heirs Selection & List */}
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-slate-100 dark:border-gray-800 transition-colors duration-300">
                      <div className="flex items-center gap-2 text-slate-800 dark:text-gray-100 mb-6">
                          <Users className="text-emerald-600 dark:text-emerald-500" size={20} />
                          <h2 className="text-lg font-semibold">{t.selectHeirs}</h2>
                      </div>
                      
                      {/* Active Heirs List */}
                      <div className="space-y-3 mb-8">
                          {selectedHeirs.length === 0 ? (
                              <div className="text-center py-8 text-slate-400 dark:text-gray-500 border-2 border-dashed border-slate-200 dark:border-gray-700 rounded-lg bg-slate-50/50 dark:bg-gray-800/50">
                                  <p>{t.noHeirs}</p>
                                  <p className="text-sm mt-1">{t.noHeirsHint}</p>
                              </div>
                          ) : (
                              selectedHeirs.map((heir) => (
                                  <HeirInputRow 
                                      key={heir.type} 
                                      type={heir.type} 
                                      count={heir.count}
                                      lang={language}
                                      onUpdate={(c) => updateHeirCount(heir.type, c)}
                                      onRemove={() => removeHeir(heir.type)}
                                  />
                              ))
                          )}
                      </div>

                      {/* Fixed Menu Grid */}
                      <div>
                        <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-3 uppercase tracking-wider text-xs">{t.addHeirType}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {AVAILABLE_HEIRS.map((type, index) => {
                            const isSelected = isHeirSelected(type);
                            const disabled = isHeirDisabled(type);
                            
                            return (
                              <button
                                key={type}
                                onClick={() => !disabled && addHeir(type)}
                                disabled={disabled}
                                className={`
                                  relative flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm font-medium transition-all
                                  ${isSelected 
                                    ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 shadow-sm' 
                                    : disabled
                                      ? 'bg-slate-50 dark:bg-gray-800 border-slate-100 dark:border-gray-700 text-slate-300 dark:text-gray-600 cursor-not-allowed'
                                      : 'bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm hover:text-emerald-600 dark:hover:text-emerald-400'
                                  }
                                `}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] flex items-center justify-center w-5 h-5 rounded-full shrink-0 ${isSelected ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100' : 'bg-slate-100 dark:bg-gray-700 text-slate-400 dark:text-gray-500'}`}>
                                    {index + 1}
                                  </span>
                                  <span className="truncate">{HEIR_NAMES[language][type]}</span>
                                </div>
                                {isSelected && <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400 shrink-0" />
                          {error}
                      </div>
                  )}

                  {/* Action Button */}
                  <button
                      onClick={handleCalculate}
                      disabled={loading}
                      className="w-full bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-slate-200 dark:shadow-none transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                      {loading ? (
                          <>
                              <Loader2 className="animate-spin" size={20} />
                              {t.calculating}
                          </>
                      ) : (
                          <>
                              {t.calculate}
                              {language === 'ar' ? (
                                  <ChevronLeft size={20} className="opacity-60" />
                              ) : (
                                  <ChevronRight size={20} className="opacity-60" />
                              )}
                          </>
                      )}
                  </button>

                  {/* Static Inheritance Rules Reference */}
                  <InheritanceRules lang={language} />
              </div>
          ) : (
              /* Results View */
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-slate-100 dark:border-gray-800 p-1 md:p-6 transition-colors duration-300">
                       <div className="mb-6 flex items-center justify-between px-4 pt-4 md:pt-0 md:px-0">
                          <h2 className="text-xl font-bold text-slate-800 dark:text-gray-100">{t.resultsTitle}</h2>
                          <button onClick={handleReset} className="text-sm text-slate-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 underline">
                              {t.editInput}
                          </button>
                       </div>
                       <ResultsView result={result} lang={language} currency={currency} onReset={handleReset} isDarkMode={darkMode} />
                  </div>
                  
                  {/* Show rules here as well for reference during result viewing */}
                  <InheritanceRules lang={language} />
              </div>
          )}
        </main>

        {/* Footer Credit */}
        <footer className="py-8 text-center mt-auto">
          <p className="text-slate-800 dark:text-gray-400 font-light text-sm transition-colors duration-300">
            Made by Zainab Johar
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;