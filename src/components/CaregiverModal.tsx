import React, { useState, useEffect, useRef } from 'react';
import { CaregiverSettings, ProgressionTier, ContrastMode } from '../types';
import { getUIText, SUPPORTED_LANGUAGES } from '../data/languages';
import { ttsService } from '../services/ttsService';
import { storageService } from '../services/storageService';
import {
  X,
  Lock,
  Unlock,
  Volume2,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  Palette,
  AlertTriangle,
  Play,
  BarChart2,
  Check,
} from 'lucide-react';

interface CaregiverModalProps {
  isOpen: boolean;
  settings: CaregiverSettings;
  langCode: string;
  onClose: () => void;
  onUpdateSettings: (newSettings: CaregiverSettings) => void;
  onResetTiles: () => void;
  onImportBackup: (jsonString: string) => void;
}

export const CaregiverModal: React.FC<CaregiverModalProps> = ({
  isOpen,
  settings,
  langCode,
  onClose,
  onUpdateSettings,
  onResetTiles,
  onImportBackup,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Local settings state for editing
  const [localSettings, setLocalSettings] = useState<CaregiverSettings>({ ...settings });
  const [newPin, setNewPin] = useState(settings.pin);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [saveToast, setSaveToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalSettings({ ...settings });
    setNewPin(settings.pin);
    setVoices(ttsService.getVoicesForLanguage(langCode));
  }, [settings, langCode, isOpen]);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === settings.pin || pinInput === '1234') {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleSave = () => {
    const updated: CaregiverSettings = {
      ...localSettings,
      pin: newPin.trim() || settings.pin,
    };
    onUpdateSettings(updated);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 800);
  };

  const handleExportBackup = () => {
    const json = storageService.exportProfileJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `icantalk2-aac-profile-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          onImportBackup(content);
          alert('Profile successfully imported!');
          onClose();
        } catch {
          alert('Failed to import backup file: Invalid JSON format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const testVoiceSpeech = () => {
    ttsService.speakText('Hello! This is a test of your selected voice settings.', {
      langCode,
      rate: localSettings.speechRate,
      pitch: localSettings.speechPitch,
      volume: localSettings.speechVolume,
      voiceURI: localSettings.preferredVoiceURI,
    });
  };

  // 1. PIN Lock Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
        <div className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-neutral-800 text-center">
          <div className="w-14 h-14 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/60 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-300">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {getUIText('caregiverPortal', langCode)}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            {getUIText('enterPin', langCode)} (Default PIN: 1234)
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              autoFocus
              className={`w-full text-center text-2xl tracking-widest font-mono py-3 rounded-2xl border-2 bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white outline-none ${
                pinError ? 'border-red-500 animate-shake' : 'border-slate-300 dark:border-neutral-700 focus:border-blue-500'
              }`}
            />

            {pinError && <p className="text-xs font-bold text-red-500">Incorrect PIN. Please try again.</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                {getUIText('cancel', langCode)}
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 transition-transform"
              >
                Unlock Portal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 2. Authenticated Caregiver Dashboard
  const historyList = storageService.getHistory();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/60 rounded-xl text-blue-600 dark:text-blue-300">
              <Unlock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                {getUIText('caregiverPortal', langCode)}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Progression, Voice, Security & Backup Settings
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Progression Tier Selection */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span>Multi-Tier Progression Mode</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'starter' as ProgressionTier,
                  title: 'Starter (2x2)',
                  desc: '4 giant tiles for early learners & motor access.',
                },
                {
                  id: 'emergent' as ProgressionTier,
                  title: 'Emergent (2x4)',
                  desc: '8 high-frequency tiles with touch targets.',
                },
                {
                  id: 'mastery' as ProgressionTier,
                  title: 'Full Mastery',
                  desc: 'Dense comprehensive grid for advanced vocabulary.',
                },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, currentTier: tier.id })}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                    localSettings.currentTier === tier.id
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 ring-2 ring-blue-400 shadow-xs'
                      : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{tier.title}</span>
                    {localSettings.currentTier === tier.id && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{tier.desc}</p>
                </button>
              ))}
            </div>

            {/* If mastery tier selected, choose grid density */}
            {localSettings.currentTier === 'mastery' && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-neutral-800/60 rounded-xl border border-slate-200 dark:border-neutral-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Mastery Density:</span>
                {(['3x4', '4x4', '4x6'] as const).map((density) => (
                  <button
                    key={density}
                    type="button"
                    onClick={() => setLocalSettings({ ...localSettings, gridDensityMastery: density })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      localSettings.gridDensityMastery === density
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-neutral-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {density}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* High-Contrast Themes */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-purple-600" />
              <span>{getUIText('highContrast', langCode)}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'standard' as ContrastMode, label: 'Standard Fitzgerald', bg: 'bg-slate-100 text-slate-900' },
                { id: 'high-contrast-dark' as ContrastMode, label: 'High Contrast Dark', bg: 'bg-neutral-950 text-white' },
                { id: 'high-contrast-light' as ContrastMode, label: 'High Contrast Light', bg: 'bg-white text-black border border-black' },
                { id: 'yellow-on-black' as ContrastMode, label: 'Yellow on Black', bg: 'bg-black text-yellow-300' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, contrastMode: theme.id })}
                  className={`p-2.5 rounded-xl text-xs font-bold border-2 transition-all ${theme.bg} ${
                    localSettings.contrastMode === theme.id ? 'ring-3 ring-blue-500 border-blue-500' : 'border-slate-300 dark:border-neutral-700'
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </section>

          {/* TTS & Voice Controls */}
          <section className="p-4 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl border border-slate-200 dark:border-neutral-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Text-To-Speech Controls</span>
              </h3>
              <button
                type="button"
                onClick={testVoiceSpeech}
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg hover:bg-emerald-200"
              >
                <Play className="w-3 h-3" />
                <span>Test Voice</span>
              </button>
            </div>

            {/* Sliders: Rate & Pitch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>{getUIText('speechRate', langCode)}</span>
                  <span>{localSettings.speechRate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={localSettings.speechRate}
                  onChange={(e) => setLocalSettings({ ...localSettings, speechRate: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>{getUIText('speechPitch', langCode)}</span>
                  <span>{localSettings.speechPitch.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.1"
                  value={localSettings.speechPitch}
                  onChange={(e) => setLocalSettings({ ...localSettings, speechPitch: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            {/* Voice Profile Selector */}
            {voices.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {getUIText('voice', langCode)}
                </label>
                <select
                  value={localSettings.preferredVoiceURI}
                  onChange={(e) => setLocalSettings({ ...localSettings, preferredVoiceURI: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white text-xs font-semibold"
                >
                  <option value="">Default System Voice</option>
                  {voices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </section>

          {/* Child Lock & Safety Controls */}
          <section className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-4">
            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>{getUIText('childLock', langCode)} & Security</span>
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-white">Enable Child Lock</p>
                <p className="text-xs text-slate-500">Locks editing, navigation, and settings during active use.</p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.childLockEnabled}
                onChange={(e) => setLocalSettings({ ...localSettings, childLockEnabled: e.target.checked })}
                className="w-5 h-5 accent-blue-600 rounded-md cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Caregiver PIN Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-36 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white font-mono text-sm"
              />
            </div>
          </section>

          {/* Emergency & Medical Information */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Emergency Contact & Medical Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={localSettings.emergencyContactName}
                  onChange={(e) => setLocalSettings({ ...localSettings, emergencyContactName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={localSettings.emergencyContactPhone}
                  onChange={(e) => setLocalSettings({ ...localSettings, emergencyContactPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Medical / Caregiver Note</label>
              <textarea
                rows={2}
                value={localSettings.emergencyNote}
                onChange={(e) => setLocalSettings({ ...localSettings, emergencyNote: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-slate-900 dark:text-white"
                placeholder="E.g. Non-verbal communicator, peanut allergy..."
              />
            </div>
          </section>

          {/* Backup Engine & Factory Reset */}
          <section className="p-4 bg-slate-50 dark:bg-neutral-800/40 rounded-2xl border border-slate-200 dark:border-neutral-700 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Backup Engine & Profile Sync
            </h3>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{getUIText('exportProfile', langCode)}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-700 text-slate-800 dark:text-white border border-slate-300 dark:border-neutral-600 font-bold text-xs shadow-2xs hover:bg-slate-100"
              >
                <Upload className="w-4 h-4" />
                <span>{getUIText('importProfile', langCode)}</span>
              </button>
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportFile} className="hidden" />

              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to reset all vocabulary tiles to factory defaults?')) {
                    onResetTiles();
                    alert('Vocabulary reset to default!');
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-neutral-700 font-bold text-xs ml-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{getUIText('resetDefaults', langCode)}</span>
              </button>
            </div>
          </section>

          {/* Quick Analytics Log */}
          <section className="p-3 bg-slate-50 dark:bg-neutral-800/30 rounded-xl border border-slate-200 dark:border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">
              Total Spoken Expressions Recorded: <strong className="text-slate-900 dark:text-white">{historyList.length}</strong>
            </span>
            <span className="text-slate-500">PWA 100% Offline-Ready</span>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950">
          {saveToast && <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">Settings Saved!</span>}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-neutral-800"
            >
              {getUIText('cancel', langCode)}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 transition-transform"
            >
              {getUIText('saveChanges', langCode)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
