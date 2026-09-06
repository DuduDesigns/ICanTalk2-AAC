import React, { useState } from 'react';
import { SpokenHistoryItem } from '../types';
import { getUIText } from '../data/languages';
import { X, Volume2, Star, Plus, Trash2, Search, History } from 'lucide-react';

interface PhraseHistoryDrawerProps {
  isOpen: boolean;
  history: SpokenHistoryItem[];
  langCode: string;
  onClose: () => void;
  onSpeakText: (text: string) => void;
  onInsertToStrip: (text: string) => void;
  onToggleFavorite: (id: string) => void;
  onClearHistory: () => void;
}

export const PhraseHistoryDrawer: React.FC<PhraseHistoryDrawerProps> = ({
  isOpen,
  history,
  langCode,
  onClose,
  onSpeakText,
  onInsertToStrip,
  onToggleFavorite,
  onClearHistory,
}) => {
  const [search, setSearch] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);

  if (!isOpen) return null;

  const filtered = history
    .filter((item) => (filterFavorites ? item.isFavorite : true))
    .filter((item) => item.fullSentence.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md h-full bg-white dark:bg-neutral-900 shadow-2xl border-l border-slate-200 dark:border-neutral-800 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              {getUIText('history', langCode)}
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

        {/* Search & Favorites Filter */}
        <div className="p-3 border-b border-slate-200 dark:border-neutral-800 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setFilterFavorites(!filterFavorites)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                filterFavorites
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300'
                  : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${filterFavorites ? 'fill-amber-400 text-amber-500' : ''}`} />
              <span>{getUIText('favoritesOnly', langCode)}</span>
            </button>

            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="text-xs text-red-500 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm italic">
              No spoken phrases found.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/60 flex flex-col gap-2 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {item.fullSentence}
                  </p>
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(item.id)}
                    className="p-1 text-slate-400 hover:text-amber-500 shrink-0"
                  >
                    <Star
                      className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400 text-amber-500' : ''}`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-400">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onInsertToStrip(item.fullSentence)}
                      className="p-1.5 rounded-lg bg-slate-200 dark:bg-neutral-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1"
                      title="Load into sentence bar"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Insert</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSpeakText(item.fullSentence)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1"
                      title="Speak again"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Speak</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
