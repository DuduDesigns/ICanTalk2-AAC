import React, { useState } from 'react';
import { AACTile, ContrastMode } from '../types';
import { getChipThemeClasses } from '../utils/themeUtils';
import { getUIText } from '../data/languages';
import { getTileDisplayLabel } from '../data/translations';
import { Volume2, Sparkles, Delete, Trash2, History, Copy, Check, MessageSquare } from 'lucide-react';

interface SentenceStripProps {
  sentenceTiles: AACTile[];
  expandedText: string | null;
  isSpeaking: boolean;
  activeWordIndex: number;
  langCode: string;
  contrastMode: ContrastMode;
  onSpeak: () => void;
  onDeleteLast: () => void;
  onClearAll: () => void;
  onRemoveIndex: (index: number) => void;
  onOpenHistory: () => void;
  onOpenQuickPhrases: () => void;
  isAiLoading?: boolean;
}

export const SentenceStrip: React.FC<SentenceStripProps> = ({
  sentenceTiles,
  expandedText,
  isSpeaking,
  activeWordIndex,
  langCode,
  contrastMode,
  onSpeak,
  onDeleteLast,
  onClearAll,
  onRemoveIndex,
  onOpenHistory,
  onOpenQuickPhrases,
  isAiLoading = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = expandedText || sentenceTiles.map(t => getTileDisplayLabel(t, langCode)).join(' ');
    if (textToCopy && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isDark = contrastMode === 'high-contrast-dark' || contrastMode === 'yellow-on-black';
  const containerBg = isDark
    ? 'bg-neutral-900 border-b-2 border-neutral-800 text-white'
    : contrastMode === 'high-contrast-light'
    ? 'bg-white border-b-2 border-black text-black'
    : 'bg-white border-b-2 border-slate-200 text-slate-900 shadow-xs';

  const hasContent = sentenceTiles.length > 0 || !!expandedText;

  return (
    <header className={`sticky top-0 z-30 w-full px-3 sm:px-4 py-2.5 ${containerBg} transition-colors`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Main Sentence Display Box */}
        <div
          id="sentence-strip-display"
          className={`flex-1 min-h-[64px] sm:min-h-[70px] px-3.5 sm:px-4 py-2 rounded-2xl flex flex-col justify-center gap-1.5 overflow-hidden border-2 ${
            isDark
              ? 'bg-neutral-950 border-neutral-700'
              : contrastMode === 'high-contrast-light'
              ? 'bg-neutral-50 border-black'
              : 'bg-slate-100 border-slate-300'
          }`}
        >
          {!hasContent ? (
            <span className="text-slate-400 dark:text-neutral-500 text-xs sm:text-sm md:text-base font-medium italic select-none">
              {getUIText('emptyStrip', langCode)}
            </span>
          ) : (
            <>
              {/* Row 1: Raw Tile Chips (Always visible to maintain building context) */}
              {sentenceTiles.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin py-0.5" style={{ scrollBehavior: 'smooth' }}>
                  {sentenceTiles.map((tile, idx) => {
                    const chipLabel = getTileDisplayLabel(tile, langCode);
                    const chipTheme = getChipThemeClasses(tile.fitzgeraldColor, contrastMode);
                    const isWordHighlighted = isSpeaking && activeWordIndex === idx;

                    return (
                      <button
                        key={`${tile.id}-${idx}`}
                        type="button"
                        onClick={() => onRemoveIndex(idx)}
                        className={`group inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg shrink-0 font-bold text-xs sm:text-sm transition-transform active:scale-95 ${chipTheme} ${
                          isWordHighlighted ? 'scale-105 ring-3 ring-indigo-500 bg-indigo-200 dark:bg-indigo-700 animate-pulse' : 'hover:scale-102'
                        }`}
                        title="Tap to remove word"
                      >
                        {tile.customImageUrl ? (
                          <img src={tile.customImageUrl} alt="" className="w-4 h-4 sm:w-5 sm:h-5 object-cover rounded-md" />
                        ) : tile.emoji ? (
                          <span className="text-sm sm:text-base leading-none">{tile.emoji}</span>
                        ) : null}
                        <span className="whitespace-nowrap uppercase tracking-tight">{chipLabel}</span>
                        <span className="text-xs opacity-50 group-hover:opacity-100 ml-0.5 font-normal">×</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Row 2: Expanded Natural Sentence Banner (Visual feedback of spoken utterance) */}
              {(expandedText || isAiLoading) && (
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm font-semibold text-indigo-950 dark:text-indigo-200 transition-all overflow-x-auto">
                  <Sparkles className={`w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 ${isAiLoading ? 'animate-spin' : ''}`} />
                  <span className="font-bold font-sans truncate">
                    {isAiLoading ? 'Expanding natural grammar...' : `"${expandedText}"`}
                  </span>
                  <span className="ml-auto text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-black tracking-wider shrink-0 hidden sm:inline">
                    Natural Speech
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
          {/* Quick Phrases shortcut */}
          <button
            type="button"
            id="btn-quick-phrases"
            onClick={onOpenQuickPhrases}
            className="flex flex-col items-center justify-center px-2.5 sm:px-3 h-12 sm:h-14 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-800 border-2 border-sky-200 transition-all active:scale-95 shadow-xs"
            title={getUIText('quickPhrases', langCode)}
          >
            <span className="text-[10px] uppercase opacity-75">{getUIText('quick', langCode) || 'Quick'}</span>
            <MessageSquare className="w-4 h-4 text-sky-700" />
          </button>

          {/* Copy sentence button */}
          {hasContent && (
            <button
              type="button"
              id="btn-copy-sentence"
              onClick={handleCopy}
              className="flex flex-col items-center justify-center px-2.5 h-12 sm:h-14 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 border-2 border-slate-300 dark:border-neutral-700 transition-all active:scale-95 shadow-xs"
              title={getUIText('copy', langCode) || 'Copy to clipboard'}
            >
              <span className="text-[10px] uppercase opacity-75">
                {copied ? (getUIText('copied', langCode) || 'Copied') : (getUIText('copy', langCode) || 'Copy')}
              </span>
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          )}

          {/* Backspace / Delete last */}
          <button
            type="button"
            id="btn-sentence-backspace"
            onClick={onDeleteLast}
            disabled={!hasContent}
            className="flex flex-col items-center justify-center px-3 sm:px-4 h-12 sm:h-14 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 border-2 border-red-200 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            title={getUIText('backspace', langCode)}
          >
            <span className="text-[10px] uppercase">{getUIText('del', langCode) || 'Del'}</span>
            <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Clear All */}
          <button
            type="button"
            id="btn-sentence-clear"
            onClick={onClearAll}
            disabled={!hasContent}
            className="flex flex-col items-center justify-center px-3 sm:px-4 h-12 sm:h-14 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 border-2 border-slate-300 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            title={getUIText('clearAll', langCode)}
          >
            <span className="text-[10px] uppercase">{getUIText('clear', langCode) || 'Clear'}</span>
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Spoken History */}
          <button
            type="button"
            id="btn-open-history"
            onClick={onOpenHistory}
            className="flex flex-col items-center justify-center px-2.5 sm:px-3 h-12 sm:h-14 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 border-2 border-slate-300 dark:border-neutral-700 transition-all active:scale-95 shadow-xs"
            title={getUIText('history', langCode)}
          >
            <span className="text-[10px] uppercase opacity-75">{getUIText('log', langCode) || 'Log'}</span>
            <History className="w-4 h-4" />
          </button>

          {/* Primary SPEAK Button with Integrated Auto-Expansion */}
          <button
            type="button"
            id="btn-speak-sentence"
            onClick={onSpeak}
            disabled={!hasContent || isAiLoading}
            className={`flex flex-col items-center justify-center px-5 sm:px-7 h-12 sm:h-14 rounded-xl font-black text-white shadow-sm transition-all active:scale-95 ${
              !hasContent
                ? 'opacity-40 cursor-not-allowed bg-slate-400'
                : isSpeaking || isAiLoading
                ? 'bg-indigo-700 ring-4 ring-indigo-300 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700 border-2 border-indigo-700'
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider opacity-90">
              {isAiLoading ? 'Expanding...' : getUIText('speak', langCode)}
            </span>
            <Volume2 className={`w-5 h-5 sm:w-6 sm:h-6 ${isSpeaking ? 'animate-bounce' : isAiLoading ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
