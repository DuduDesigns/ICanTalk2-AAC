import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES, getUIText } from '../data/languages';
import { X, Search, Check, Globe } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  currentLangCode: string;
  onClose: () => void;
  onSelectLanguage: (langCode: string) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  currentLangCode,
  onClose,
  onSelectLanguage,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              {getUIText('language', currentLangCode)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-200 dark:border-neutral-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language / Keresés..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filtered.map((lang) => {
            const isSelected = currentLangCode === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-2 border-blue-600 text-blue-950 dark:text-blue-200'
                    : 'hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-800 dark:text-neutral-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl leading-none">{lang.flag}</span>
                  <div>
                    <p className="font-bold text-sm leading-tight">{lang.nativeName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{lang.name}</p>
                  </div>
                </div>
                {isSelected && <Check className="w-5 h-5 text-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
