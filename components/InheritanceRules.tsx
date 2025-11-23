import React from 'react';
import { Language, INHERITANCE_RULES, UI_TEXT } from '../utils/translations';
import { BookOpen } from 'lucide-react';

interface InheritanceRulesProps {
  lang: Language;
}

export const InheritanceRules: React.FC<InheritanceRulesProps> = ({ lang }) => {
  const t = UI_TEXT[lang];
  const rules = INHERITANCE_RULES[lang];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-slate-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 flex items-center gap-3 transition-colors">
        <BookOpen className="text-slate-500 dark:text-gray-400" size={20} />
        <div>
          <h3 className="font-bold text-slate-800 dark:text-gray-100 text-lg">{t.rulesTitle}</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400">{t.rulesDescription}</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="bg-slate-50 dark:bg-gray-800 text-slate-500 dark:text-gray-400 uppercase text-xs font-semibold transition-colors">
            <tr>
              <th className="px-6 py-3">{t.ruleHeir}</th>
              <th className="px-6 py-3">{t.ruleCondition}</th>
              <th className="px-6 py-3">{t.ruleShare}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {rules.map((rule, index) => (
              <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-3 font-medium text-slate-900 dark:text-gray-200">{rule.heir}</td>
                <td className="px-6 py-3 text-slate-600 dark:text-gray-400">{rule.condition}</td>
                <td className="px-6 py-3 font-semibold text-emerald-700 dark:text-emerald-400">{rule.share}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};