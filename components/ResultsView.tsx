import React from 'react';
import { CalculationResult, CurrencyCode } from '../types';
import { Language, UI_TEXT } from '../utils/translations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AlertCircle, Info } from 'lucide-react';

interface ResultsViewProps {
  result: CalculationResult;
  lang: Language;
  currency: CurrencyCode;
  onReset: () => void;
  isDarkMode?: boolean;
}

const COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5', '#047857', '#065F46'];

export const ResultsView: React.FC<ResultsViewProps> = ({ result, lang, currency, onReset, isDarkMode = false }) => {
  const t = UI_TEXT[lang];
  
  const chartData = result.shares.map(share => ({
    name: share.heirType,
    value: share.shareAmount,
    displayValue: share.sharePercentage
  }));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 2
    }).format(val);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-gray-700 transition-colors">
            <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">{t.totalEstate}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(result.totalEstate)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-gray-700 transition-colors">
            <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">{t.totalDistributed}</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(result.totalEstate - result.remainingEstate)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-gray-700 transition-colors">
            <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">{t.remaining}</p>
            <p className="text-2xl font-bold text-slate-400 dark:text-gray-500">{formatCurrency(result.remainingEstate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 flex flex-col transition-colors">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-4">{t.chartTitle}</h3>
            <div className="h-64 w-full" dir="ltr"> 
                {/* Charts usually render better in LTR context even in RTL layouts unless fully adapted */}
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            stroke={isDarkMode ? '#1f2937' : '#fff'} // Gap color matches background
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ 
                                borderRadius: '8px', 
                                border: 'none', 
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                                color: isDarkMode ? '#fff' : '#000'
                            }}
                        />
                        <Legend formatter={(value) => <span className="text-slate-700 dark:text-gray-300">{value}</span>} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Breakdown Table */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 transition-colors">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100 mb-4">{t.breakdownTitle}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-xs text-slate-500 dark:text-gray-400 uppercase bg-slate-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-4 py-3 rounded-tl-lg rtl:rounded-tr-lg rtl:rounded-tl-none">{t.tableHeir}</th>
                            <th className="px-4 py-3">{t.tableShare}</th>
                            <th className="px-4 py-3 text-right rtl:text-left rounded-tr-lg rtl:rounded-tl-lg rtl:rounded-tr-none">{t.tableAmount}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {result.shares.map((share, idx) => (
                            <tr key={idx} className="border-b border-slate-100 dark:border-gray-700 last:border-none hover:bg-slate-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="font-medium text-slate-900 dark:text-gray-100">
                                        {share.heirType} <span className="text-slate-400 dark:text-gray-500 text-xs mx-1">(x{share.count})</span>
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{share.description}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium text-xs">
                                        {share.shareFraction} ({share.sharePercentage}%)
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right rtl:text-left font-semibold text-slate-700 dark:text-gray-200">
                                    {formatCurrency(share.shareAmount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 p-6 rounded-xl transition-colors">
        <div className="flex items-start gap-3">
            <Info className="text-indigo-600 dark:text-indigo-400 mt-1 shrink-0" size={20} />
            <div>
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">{t.logicTitle}</h4>
                <p className="text-indigo-800 dark:text-indigo-300 text-sm leading-relaxed whitespace-pre-line">
                    {result.explanation}
                </p>
            </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 p-4 rounded-lg flex items-start gap-3 transition-colors">
        <AlertCircle className="text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" size={18} />
        <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>{t.disclaimerTitle}</strong> {t.disclaimerText}
        </p>
      </div>

      <div className="flex justify-center pt-6">
        <button 
            onClick={onReset}
            className="px-6 py-2 bg-slate-900 dark:bg-emerald-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors font-medium"
        >
            {t.calculateAnother}
        </button>
      </div>
    </div>
  );
};