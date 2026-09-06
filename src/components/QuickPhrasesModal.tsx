import React, { useState } from 'react';
import { PREMADE_PHRASES } from '../data/premadePhrases';
import { getUIText } from '../data/languages';
import { X, Volume2, MessageSquare, Plus } from 'lucide-react';

interface QuickPhrasesModalProps {
  isOpen: boolean;
  langCode: string;
  onClose: () => void;
  onSpeakPhrase: (phrase: string) => void;
  onInsertPhrase: (phrase: string) => void;
}

export const QuickPhrasesModal: React.FC<QuickPhrasesModalProps> = ({
  isOpen,
  langCode,
  onClose,
  onSpeakPhrase,
  onInsertPhrase,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Needs', 'Feelings', 'Social', 'Emergency'];

  const filtered = PREMADE_PHRASES.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              {getUIText('quickPhrases', langCode)}
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

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-3 overflow-x-auto border-b border-slate-200 dark:border-neutral-800 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Phrases Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.map((item) => {
            const localizedText = item.translations[langCode] || item.text;
            const isEmergency = item.category === 'Emergency';

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  isEmergency
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800'
                    : 'bg-slate-50 dark:bg-neutral-800/60 border-slate-200 dark:border-neutral-800 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl shrink-0">{item.emoji}</span>
                  <p className="font-bold text-sm text-slate-900 dark:text-white leading-snug break-words">
                    {localizedText}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onInsertPhrase(localizedText);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-slate-200 dark:bg-neutral-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200"
                    title="Load into sentence bar"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSpeakPhrase(localizedText)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm active:scale-95 transition-transform"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Speak</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
