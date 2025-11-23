import React from 'react';
import { HeirType, HEIR_LIMITS } from '../types';
import { Language, HEIR_NAMES } from '../utils/translations';
import { Trash2, Plus, Minus } from 'lucide-react';

interface HeirInputRowProps {
  type: HeirType;
  count: number;
  lang: Language;
  onUpdate: (count: number) => void;
  onRemove: () => void;
}

export const HeirInputRow: React.FC<HeirInputRowProps> = ({ type, count, lang, onUpdate, onRemove }) => {
  const max = HEIR_LIMITS[type];
  const displayName = HEIR_NAMES[lang][type];

  const handleIncrement = () => {
    if (count < max) onUpdate(count + 1);
  };

  const handleDecrement = () => {
    if (count > 1) onUpdate(count - 1);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-sm mb-2 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-semibold shrink-0 transition-colors">
            {/* We use the first letter of the localized name */}
            {displayName.charAt(0)}
        </div>
        <span className="font-medium text-slate-700 dark:text-gray-200 transition-colors">{displayName}</span>
      </div>

      <div className="flex items-center gap-4">
        {max > 1 && (
          <div className="flex items-center bg-slate-100 dark:bg-gray-700 rounded-md transition-colors" dir="ltr">
            <button 
              onClick={handleDecrement}
              disabled={count <= 1}
              className="p-1.5 text-slate-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-30"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-medium text-slate-700 dark:text-gray-200">{count}</span>
            <button 
              onClick={handleIncrement}
              disabled={count >= max}
              className="p-1.5 text-slate-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-30"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
        
        <button 
          onClick={onRemove}
          className="text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-md transition-colors"
          title="Remove Heir"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};