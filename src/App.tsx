import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AACTile,
  CaregiverSettings,
  CategoryId,
  SpokenHistoryItem,
} from './types';
import { storageService, DEFAULT_SETTINGS } from './services/storageService';
import { ttsService } from './services/ttsService';
import { grammarService } from './services/grammarService';
import { SUPPORTED_LANGUAGES, getUIText } from './data/languages';
import { getTileSpokenText, getTileDisplayLabel } from './data/translations';
import { getAppBackgroundClasses } from './utils/themeUtils';

// Components
import { SentenceStrip } from './components/SentenceStrip';
import { CategoryNav } from './components/CategoryNav';
import { GridBoard } from './components/GridBoard';
import { TileEditorModal } from './components/TileEditorModal';
import { CaregiverModal } from './components/CaregiverModal';
import { LanguageModal } from './components/LanguageModal';
import { PhraseHistoryDrawer } from './components/PhraseHistoryDrawer';
import { QuickPhrasesModal } from './components/QuickPhrasesModal';
import { EmergencyModal } from './components/EmergencyModal';
import { ChildLockBanner } from './components/ChildLockBanner';

import {
  Globe,
  Settings,
  Edit,
  Check,
  Download,
  Sparkles,
} from 'lucide-react';

export function App() {
  // 1. Persistent State
  const [settings, setSettings] = useState<CaregiverSettings>(() => storageService.getSettings());
  const [tiles, setTiles] = useState<AACTile[]>(() => storageService.getTiles());
  const [langCode, setLangCode] = useState<string>(() => storageService.getSelectedLanguage());
  const [history, setHistory] = useState<SpokenHistoryItem[]>(() => storageService.getHistory());

  // 2. Active Communication Workspace State
  const [sentenceTiles, setSentenceTiles] = useState<AACTile[]>([]);
  const [expandedText, setExpandedText] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('core');
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Navigable Categories for direction tracking
  const NAVIGABLE_CATEGORIES: CategoryId[] = [
    'core',
    'actions',
    'food',
    'feelings',
    'places',
    'toys',
    'people',
    'social',
  ];

  const handleSelectCategory = useCallback(
    (newCat: CategoryId) => {
      if (newCat === activeCategory) return;
      const oldIdx = NAVIGABLE_CATEGORIES.indexOf(activeCategory);
      const newIdx = NAVIGABLE_CATEGORIES.indexOf(newCat);
      if (oldIdx !== -1 && newIdx !== -1) {
        setSlideDirection(newIdx >= oldIdx ? 1 : -1);
      }
      setActiveCategory(newCat);
    },
    [activeCategory]
  );

  // 3. Modals & Drawers State
  const [editingTile, setEditingTile] = useState<AACTile | null>(null);
  const [isCaregiverModalOpen, setIsCaregiverModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isQuickPhrasesOpen, setIsQuickPhrasesOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // 4. PWA Installation Deferred Prompt
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // Current Language Object
  const currentLanguage = SUPPORTED_LANGUAGES.find((l) => l.code === langCode) || SUPPORTED_LANGUAGES[0];

  // PWA Install Event Listener
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallBtn(false);
      }
      setDeferredInstallPrompt(null);
    }
  };

  // Keyboard Shortcuts (Space to Speak, Backspace to delete last, Esc to Clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === ' ' && sentenceTiles.length > 0) {
        e.preventDefault();
        handleSpeakSentence();
      } else if (e.key === 'Backspace' && (sentenceTiles.length > 0 || expandedText)) {
        e.preventDefault();
        handleDeleteLastTile();
      } else if (e.key === 'Escape' && (sentenceTiles.length > 0 || expandedText)) {
        e.preventDefault();
        handleClearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sentenceTiles, expandedText, settings, langCode]);

  // -------------------------------------------------------------
  // COMMUNICATION ACTIONS
  // -------------------------------------------------------------

  // Select Tile into Sentence Strip
  const handleSelectTile = useCallback(
    (tile: AACTile) => {
      // Feedback click and haptic
      ttsService.playFeedbackClick(settings.soundEffectsEnabled);
      ttsService.triggerHaptic(settings.hapticsEnabled);

      // Auto-speak individual tile on tap if enabled
      if (settings.autoSpeakOnTap) {
        if (tile.useRecordedAudio && tile.audioRecordedBase64) {
          ttsService.playAudioClip(tile.audioRecordedBase64);
        } else {
          const tileText = getTileSpokenText(tile, langCode);
          ttsService.speakText(tileText, {
            langCode,
            rate: settings.speechRate,
            pitch: settings.speechPitch,
            volume: settings.speechVolume,
            voiceURI: settings.preferredVoiceURI,
          });
        }
      }

      // Append to active sentence strip & clear previous expanded text
      setSentenceTiles((prev) => [...prev, tile]);
      setExpandedText(null);
    },
    [settings, langCode]
  );

  // Speak Sentence with Automatic AI Grammar Expansion on Speak
  const handleSpeakSentence = useCallback(async () => {
    if (sentenceTiles.length === 0 && !expandedText) return;

    let textToSpeak = expandedText;
    const rawTokens = sentenceTiles.map(
      (t) => getTileSpokenText(t, langCode)
    );

    // If expanded text is not yet generated, automatically expand before speaking
    if (!textToSpeak) {
      if (sentenceTiles.length === 1) {
        // If single tile has custom recorded audio, prioritize playing it
        const singleTile = sentenceTiles[0];
        if (singleTile.useRecordedAudio && singleTile.audioRecordedBase64) {
          setIsSpeaking(true);
          await ttsService.playAudioClip(singleTile.audioRecordedBase64);
          setIsSpeaking(false);
          setExpandedText(getTileDisplayLabel(singleTile, langCode));
          return;
        }

        // Single-word taps: speak single word immediately without filler words
        const single = rawTokens[0].trim();
        textToSpeak = single.charAt(0).toUpperCase() + single.slice(1);
        setExpandedText(textToSpeak);
      } else if (sentenceTiles.length > 1) {
        // Multi-word sequence: automatically expand & conjugate into a natural sentence
        setIsAiLoading(true);
        const result = await grammarService.expandTokens(
          rawTokens,
          currentLanguage.name,
          langCode,
          'natural'
        );
        setIsAiLoading(false);
        textToSpeak = result.expandedText || rawTokens.join(' ');
        setExpandedText(textToSpeak);
      } else {
        return;
      }
    }

    if (!textToSpeak || !textToSpeak.trim()) return;

    setIsSpeaking(true);
    setActiveWordIndex(0);

    // Save to history
    const newHist = storageService.addHistoryItem({
      fullSentence: textToSpeak,
      rawTokens: rawTokens.length > 0 ? rawTokens : [textToSpeak],
      languageCode: langCode,
      isFavorite: false,
    });
    setHistory((prev) => [newHist, ...prev.filter((h) => h.fullSentence !== textToSpeak)].slice(0, 150));

    // Execute Speech Synthesis with word tracking
    await ttsService.speakText(textToSpeak, {
      langCode,
      rate: settings.speechRate,
      pitch: settings.speechPitch,
      volume: settings.speechVolume,
      voiceURI: settings.preferredVoiceURI,
      onWordBoundary: (charIndex) => {
        // Calculate rough active tile index from charIndex
        const words = textToSpeak!.slice(0, charIndex).trim().split(/\s+/);
        const index = Math.min(sentenceTiles.length - 1, Math.max(0, words.length - 1));
        setActiveWordIndex(index);
      },
    });

    setIsSpeaking(false);
    setActiveWordIndex(-1);

    if (settings.clearAfterSpeak) {
      setSentenceTiles([]);
      setExpandedText(null);
    }
  }, [sentenceTiles, expandedText, langCode, currentLanguage, settings]);

  const handleDeleteLastTile = () => {
    if (expandedText && sentenceTiles.length === 0) {
      setExpandedText(null);
    } else {
      setSentenceTiles((prev) => prev.slice(0, -1));
      setExpandedText(null);
    }
  };

  const handleClearAll = () => {
    setSentenceTiles([]);
    setExpandedText(null);
    ttsService.stop();
  };

  const handleRemoveIndex = (index: number) => {
    setSentenceTiles((prev) => prev.filter((_, i) => i !== index));
    setExpandedText(null);
  };

  // -------------------------------------------------------------
  // TILE CUSTOMIZATION & MANAGEMENT
  // -------------------------------------------------------------

  const handleEditTile = (tile: AACTile) => {
    if (settings.childLockEnabled) return;
    setEditingTile(tile);
  };

  const handleAddNewTile = (categoryId: CategoryId) => {
    if (settings.childLockEnabled) return;
    const newTile: AACTile = {
      id: 'custom_tile_' + Date.now(),
      label: 'New Tile',
      category: categoryId === 'core' ? 'actions' : categoryId,
      fitzgeraldColor: 'noun',
      emoji: '⭐',
      tierMin: settings.currentTier,
      isCoreAnchor: categoryId === 'core',
      order: tiles.length + 1,
      translations: {
        [langCode]: 'New Tile',
      },
    };
    setEditingTile(newTile);
  };

  const handleSaveTile = (updated: AACTile) => {
    const existingIndex = tiles.findIndex((t) => t.id === updated.id);
    let newTiles: AACTile[];
    if (existingIndex >= 0) {
      newTiles = [...tiles];
      newTiles[existingIndex] = updated;
    } else {
      newTiles = [...tiles, updated];
    }
    setTiles(newTiles);
    storageService.saveTiles(newTiles);
  };

  const handleDeleteTile = (tileId: string) => {
    const newTiles = tiles.filter((t) => t.id !== tileId);
    setTiles(newTiles);
    storageService.saveTiles(newTiles);
  };

  const handleResetTiles = () => {
    const reset = storageService.resetTilesToDefault();
    setTiles(reset);
  };

  // -------------------------------------------------------------
  // SETTINGS & LANGUAGE HANDLERS
  // -------------------------------------------------------------

  const handleUpdateSettings = (newSettings: CaregiverSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  const handleSelectLanguage = (newLangCode: string) => {
    setLangCode(newLangCode);
    storageService.saveSelectedLanguage(newLangCode);
  };

  const handleImportBackup = (jsonString: string) => {
    const backup = storageService.importProfileJSON(jsonString);
    setSettings(backup.settings);
    setTiles(backup.customTiles);
    if (backup.history) setHistory(backup.history);
    if (backup.selectedLanguage) setLangCode(backup.selectedLanguage);
  };

  const handleToggleFavoriteHistory = (id: string) => {
    const updated = storageService.toggleFavoriteHistory(id);
    setHistory(updated);
  };

  const handleClearHistory = () => {
    storageService.clearHistory();
    setHistory([]);
  };

  const handleSpeakTextDirect = (text: string) => {
    ttsService.speakText(text, {
      langCode,
      rate: settings.speechRate,
      pitch: settings.speechPitch,
      volume: settings.speechVolume,
      voiceURI: settings.preferredVoiceURI,
    });
  };

  const handleInsertTextToStrip = (text: string) => {
    setExpandedText(text);
    setSentenceTiles([]);
  };

  const bgThemeClass = getAppBackgroundClasses(settings.contrastMode);

  return (
    <div
      id="icantalk2-app-root"
      className={`flex flex-col h-screen w-screen overflow-hidden select-none font-sans transition-colors duration-300 ease-in-out ${bgThemeClass}`}
    >
      {/* 1. Child Lock Banner (if active) */}
      <ChildLockBanner
        isLocked={settings.childLockEnabled}
        pin={settings.pin}
        langCode={langCode}
        onUnlock={() => handleUpdateSettings({ ...settings, childLockEnabled: false })}
      />

      {/* 2. Top Navigation Bar */}
      <nav
        aria-label="Main Navigation"
        className="w-full px-3 sm:px-5 py-2 flex items-center justify-between border-b-2 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0 z-20 shadow-xs"
      >
        {/* Brand & Mode Tag */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-xs border border-indigo-700 tracking-tight">
            IC<span className="text-amber-300">2</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                ICanTalk2 AAC
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                {settings.currentTier === 'mastery'
                  ? `${getUIText('tierMastery', langCode)} (${settings.gridDensityMastery})`
                  : settings.currentTier === 'emergent'
                  ? getUIText('tierEmergent', langCode)
                  : getUIText('tierStarter', langCode)}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
              Progressive Speech Matrix • 100% Offline PWA
            </span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button (if eligible) */}
          {showInstallBtn && (
            <button
              type="button"
              id="btn-install-pwa"
              onClick={handleInstallPWA}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95 animate-pulse"
              title="Install ICanTalk2 AAC as Desktop/Tablet App"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{getUIText('installApp', langCode) || 'Install App'}</span>
            </button>
          )}

          {/* Language Selector */}
          <button
            type="button"
            id="btn-open-language"
            onClick={() => setIsLanguageModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-neutral-700 transition-colors"
            title="Switch Language / Válassz nyelvet"
          >
            <span className="text-sm">{currentLanguage.flag}</span>
            <span className="hidden md:inline">{currentLanguage.nativeName}</span>
            <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          </button>

          {/* Tile Edit Mode Toggle */}
          {!settings.childLockEnabled && (
            <button
              type="button"
              id="btn-toggle-edit-mode"
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                isEditMode
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-neutral-700'
              }`}
              title="Customize Tiles / Studio"
            >
              {isEditMode ? <Check className="w-3.5 h-3.5" /> : <Edit className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isEditMode ? getUIText('done', langCode) : getUIText('editTiles', langCode)}</span>
            </button>
          )}

          {/* Caregiver Portal (PIN Protected) */}
          <button
            type="button"
            id="btn-open-caregiver"
            onClick={() => setIsCaregiverModalOpen(true)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-neutral-700 transition-colors"
            title={getUIText('caregiverPortal', langCode)}
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-300" />
          </button>
        </div>
      </nav>

      {/* 3. Persistent Sentence Strip */}
      <SentenceStrip
        sentenceTiles={sentenceTiles}
        expandedText={expandedText}
        isSpeaking={isSpeaking}
        activeWordIndex={activeWordIndex}
        langCode={langCode}
        contrastMode={settings.contrastMode}
        onSpeak={handleSpeakSentence}
        onDeleteLast={handleDeleteLastTile}
        onClearAll={handleClearAll}
        onRemoveIndex={handleRemoveIndex}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        onOpenQuickPhrases={() => setIsQuickPhrasesOpen(true)}
        isAiLoading={isAiLoading}
      />

      {/* 4. Category Tabs */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        langCode={langCode}
        contrastMode={settings.contrastMode}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />

      {/* 5. Fluid Responsive AAC Communication Grid */}
      <main className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
        <GridBoard
          tiles={tiles}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          slideDirection={slideDirection}
          currentTier={settings.currentTier}
          gridDensityMastery={settings.gridDensityMastery}
          contrastMode={settings.contrastMode}
          langCode={langCode}
          isEditMode={isEditMode}
          isSwipeDisabled={
            editingTile !== null ||
            isCaregiverModalOpen ||
            isLanguageModalOpen ||
            isHistoryDrawerOpen ||
            isQuickPhrasesOpen ||
            isEmergencyModalOpen
          }
          onSelectTile={handleSelectTile}
          onEditTile={handleEditTile}
          onAddNewTile={handleAddNewTile}
        />
      </main>

      {/* 6. Sleek Interface Bottom Status & Control Bar */}
      <footer className="h-14 sm:h-16 bg-slate-900 text-white flex items-center px-4 sm:px-6 justify-between border-t-4 border-indigo-500 shrink-0 z-20">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex flex-col cursor-pointer" onClick={() => setIsLanguageModalOpen(true)}>
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">{getUIText('language', langCode)}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg">{currentLanguage.flag}</span>
              <span className="font-bold text-xs sm:text-sm">{currentLanguage.name}</span>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-slate-700 hidden sm:block"></div>

          <div className="flex flex-col cursor-pointer hidden sm:flex" onClick={() => setIsCaregiverModalOpen(true)}>
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">{getUIText('mode', langCode) || 'Mode'}</span>
            <span className="font-bold text-xs sm:text-sm text-indigo-300">
              {settings.currentTier === 'starter'
                ? `${getUIText('tierStarter', langCode)} (2x2)`
                : settings.currentTier === 'emergent'
                ? `${getUIText('tierEmergent', langCode)} (2x4)`
                : `${getUIText('tierMastery', langCode)} (${settings.gridDensityMastery})`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            id="btn-footer-childlock"
            onClick={() => handleUpdateSettings({ ...settings, childLockEnabled: !settings.childLockEnabled })}
            className={`px-3 sm:px-4 py-2 rounded-lg border font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors ${
              settings.childLockEnabled
                ? 'bg-amber-600 hover:bg-amber-700 border-amber-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
            }`}
          >
            <span>{settings.childLockEnabled ? '🔓' : '🔒'}</span>
            <span className="hidden sm:inline">{settings.childLockEnabled ? (getUIText('unlock', langCode) || 'Unlock') : (getUIText('childLock', langCode) || 'Child Lock')}</span>
          </button>

          <button
            type="button"
            id="btn-footer-caregiver"
            onClick={() => setIsCaregiverModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 px-3.5 sm:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm text-white flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>⚙️</span>
            <span>{getUIText('caregiverSettings', langCode) || 'Caregiver Settings'}</span>
          </button>
        </div>
      </footer>

      {/* 6. Modals and Drawers */}

      {/* Tile Studio Modal (Deep edit + live audio recorder) */}
      <TileEditorModal
        tile={editingTile}
        isOpen={Boolean(editingTile)}
        langCode={langCode}
        onClose={() => setEditingTile(null)}
        onSave={handleSaveTile}
        onDelete={handleDeleteTile}
      />

      {/* Caregiver Portal Modal (PIN-protected, speech sliders, backups) */}
      <CaregiverModal
        isOpen={isCaregiverModalOpen}
        settings={settings}
        langCode={langCode}
        onClose={() => setIsCaregiverModalOpen(false)}
        onUpdateSettings={handleUpdateSettings}
        onResetTiles={handleResetTiles}
        onImportBackup={handleImportBackup}
      />

      {/* 18-Language Selection Modal */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        currentLangCode={langCode}
        onClose={() => setIsLanguageModalOpen(false)}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Spoken History Drawer */}
      <PhraseHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        history={history}
        langCode={langCode}
        onClose={() => setIsHistoryDrawerOpen(false)}
        onSpeakText={handleSpeakTextDirect}
        onInsertToStrip={handleInsertTextToStrip}
        onToggleFavorite={handleToggleFavoriteHistory}
        onClearHistory={handleClearHistory}
      />

      {/* Categorized Quick Phrases Modal */}
      <QuickPhrasesModal
        isOpen={isQuickPhrasesOpen}
        langCode={langCode}
        onClose={() => setIsQuickPhrasesOpen(false)}
        onSpeakPhrase={handleSpeakTextDirect}
        onInsertPhrase={handleInsertTextToStrip}
      />

      {/* Panic / Emergency Alert Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        settings={settings}
        langCode={langCode}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
}

export default App;
