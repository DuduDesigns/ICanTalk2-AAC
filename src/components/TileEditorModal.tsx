import React, { useState, useRef, useEffect } from 'react';
import { AACTile, CategoryId, FitzgeraldColor, ProgressionTier } from '../types';
import { AAC_CATEGORIES } from '../data/initialTiles';
import { getUIText } from '../data/languages';
import { ttsService } from '../services/ttsService';
import { X, Mic, Square, Play, Trash2, Image, Sparkles, Check } from 'lucide-react';

interface TileEditorModalProps {
  tile: AACTile | null;
  isOpen: boolean;
  langCode: string;
  onClose: () => void;
  onSave: (updatedTile: AACTile) => void;
  onDelete?: (tileId: string) => void;
}

const COMMON_EMOJIS = [
  '👤', '👉', '➕', '🛑', '🆘', '👍', '✅', '❌', '🚶', '👀', '🙏', '🌸',
  '🍽️', '🥤', '🎲', '🛏️', '📺', '📖', '🎵', '🧼', '🚪', '🔒', '🏃', '🤗',
  '💧', '🍎', '🥛', '🧃', '🍞', '🍕', '🍌', '🍪', '🧀', '🍲', '🍝', '🍗',
  '😊', '😢', '🥱', '🩹', '😠', '🤤', '😨', '🤒', '🥰', '🥶', '🥵', '😎',
  '🏠', '🚽', '🌳', '🏫', '🚗', '🏥', '🛒', '⛺', '🏖️', '🚌', '🎡', '📚',
  '⚽', '📱', '🧱', '🧩', '🖍️', '🫧', '🧸', '🚂', '🚲', '🎮', '🎈', '🎨',
  '👩', '👨', '🧑‍🏫', '👫', '👶', '👵', '👴', '🐕', '🐈', '🩺', '👮', '🧑‍🍳',
  '👋', '🙋', '🥺', '❤️', '🚨', '🚑', '🧭', '💊', '⭐', '💡', '⏰', '🎉'
];

const FITZGERALD_OPTIONS: { id: FitzgeraldColor; label: string; bg: string; border: string }[] = [
  { id: 'pronoun', label: 'Pronoun / Person (Yellow)', bg: 'bg-yellow-100', border: 'border-yellow-400' },
  { id: 'verb', label: 'Action / Verb (Green)', bg: 'bg-emerald-100', border: 'border-emerald-400' },
  { id: 'noun', label: 'Object / Place (Orange)', bg: 'bg-orange-100', border: 'border-orange-400' },
  { id: 'descriptor', label: 'Feeling / Adjective (Blue)', bg: 'bg-sky-100', border: 'border-sky-400' },
  { id: 'social', label: 'Social / Politeness (Pink)', bg: 'bg-pink-100', border: 'border-pink-400' },
  { id: 'emergency', label: 'Emergency / Urgent (Red)', bg: 'bg-red-100', border: 'border-red-500' },
  { id: 'preposition', label: 'Preposition / Other (Purple)', bg: 'bg-purple-100', border: 'border-purple-400' },
];

export const TileEditorModal: React.FC<TileEditorModalProps> = ({
  tile,
  isOpen,
  langCode,
  onClose,
  onSave,
  onDelete,
}) => {
  const [label, setLabel] = useState('');
  const [spokenText, setSpokenText] = useState('');
  const [category, setCategory] = useState<CategoryId>('core');
  const [fitzgeraldColor, setFitzgeraldColor] = useState<FitzgeraldColor>('pronoun');
  const [emoji, setEmoji] = useState('⭐');
  const [customImageUrl, setCustomImageUrl] = useState<string | undefined>(undefined);
  const [audioRecordedBase64, setAudioRecordedBase64] = useState<string | undefined>(undefined);
  const [useRecordedAudio, setUseRecordedAudio] = useState(false);
  const [tierMin, setTierMin] = useState<ProgressionTier>('emergent');

  // MediaRecorder state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (tile) {
      setLabel(tile.translations?.[langCode] || tile.label);
      setSpokenText(tile.spokenText || '');
      setCategory(tile.category);
      setFitzgeraldColor(tile.fitzgeraldColor);
      setEmoji(tile.emoji || '⭐');
      setCustomImageUrl(tile.customImageUrl);
      setAudioRecordedBase64(tile.audioRecordedBase64);
      setUseRecordedAudio(tile.useRecordedAudio || false);
      setTierMin(tile.tierMin || 'emergent');
    }
  }, [tile, langCode]);

  if (!isOpen || !tile) return null;

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioRecordedBase64(base64data);
          setUseRecordedAudio(true);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access denied or error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  const playRecordedAudio = async () => {
    if (!audioRecordedBase64) return;
    setIsPlayingAudio(true);
    await ttsService.playAudioClip(audioRecordedBase64);
    setIsPlayingAudio(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updated: AACTile = {
      ...tile,
      label: label.trim() || tile.label,
      spokenText: spokenText.trim() || undefined,
      category,
      fitzgeraldColor,
      emoji,
      customImageUrl,
      audioRecordedBase64,
      useRecordedAudio,
      tierMin,
      translations: {
        ...(tile.translations || {}),
        [langCode]: label.trim() || tile.label,
      },
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              {getUIText('editTile', langCode)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Label Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {getUIText('tileLabel', langCode)}
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Water"
            />
          </div>

          {/* Spoken Text Override */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {getUIText('spokenText', langCode)}
            </label>
            <input
              type="text"
              value={spokenText}
              onChange={(e) => setSpokenText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Leave empty to speak tile label"
            />
          </div>

          {/* Fitzgerald Color Palette */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              {getUIText('colorCode', langCode)}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FITZGERALD_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFitzgeraldColor(opt.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl border-2 text-xs font-bold text-slate-900 transition-all ${opt.bg} ${opt.border} ${
                    fitzgeraldColor === opt.id ? 'ring-3 ring-blue-500 scale-102 shadow-sm' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <span className="truncate">{opt.label.split(' ')[0]}</span>
                  {fitzgeraldColor === opt.id && <Check className="w-3.5 h-3.5 ml-auto text-blue-700" />}
                </button>
              ))}
            </div>
          </div>

          {/* Emoji & Image Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Visual Icon / Emoji
              </label>
              <label className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                <Image className="w-4 h-4" />
                <span>{getUIText('uploadImage', langCode)}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {customImageUrl ? (
              <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-neutral-800 rounded-xl mb-3">
                <img src={customImageUrl} alt="" className="w-14 h-14 object-cover rounded-xl border border-slate-300" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Custom Photo Selected</p>
                  <button
                    type="button"
                    onClick={() => setCustomImageUrl(undefined)}
                    className="text-xs text-red-500 hover:underline mt-1"
                  >
                    Remove Photo
                  </button>
                </div>
              </div>
            ) : null}

            {/* Emoji Grid */}
            <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 dark:bg-neutral-800/60 rounded-xl max-h-36 overflow-y-auto border border-slate-200 dark:border-neutral-700">
              {COMMON_EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => {
                    setEmoji(em);
                    setCustomImageUrl(undefined);
                  }}
                  className={`p-1.5 rounded-lg text-xl hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors ${
                    emoji === em && !customImageUrl ? 'bg-blue-100 dark:bg-blue-900/60 ring-2 ring-blue-500' : ''
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Tile Audio Studio: Real Voice Recorder */}
          <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                <h3 className="font-bold text-sm text-purple-950 dark:text-purple-200">
                  Tile Audio Studio (Voice Recorder)
                </h3>
              </div>
              {audioRecordedBase64 && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                  Audio Attached
                </span>
              )}
            </div>

            <p className="text-xs text-purple-900/80 dark:text-purple-300">
              Record a real human voice clip (e.g. parent/caregiver) for this tile instead of synthetic TTS.
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
                >
                  <Mic className="w-4 h-4" />
                  <span>{getUIText('recordVoice', langCode)}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm animate-pulse"
                >
                  <Square className="w-4 h-4" />
                  <span>{getUIText('stopRecording', langCode)} ({recordingSeconds}s)</span>
                </button>
              )}

              {audioRecordedBase64 && (
                <>
                  <button
                    type="button"
                    onClick={playRecordedAudio}
                    disabled={isPlayingAudio}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 text-purple-900 dark:text-purple-200 font-bold text-xs border border-purple-300 shadow-2xs hover:bg-purple-100"
                  >
                    <Play className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-spin' : ''}`} />
                    <span>{getUIText('playVoice', langCode)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAudioRecordedBase64(undefined);
                      setUseRecordedAudio(false);
                    }}
                    className="p-1.5 rounded-xl text-red-600 hover:bg-red-100 dark:hover:bg-neutral-800 transition-colors"
                    title={getUIText('deleteVoice', langCode)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Category & Progression Tier Assignment */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                {getUIText('category', langCode)}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white text-xs font-semibold"
              >
                {AAC_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.defaultName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Minimum Tier
              </label>
              <select
                value={tierMin}
                onChange={(e) => setTierMin(e.target.value as ProgressionTier)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white text-xs font-semibold"
              >
                <option value="starter">{getUIText('tierStarter', langCode)}</option>
                <option value="emergent">{getUIText('tierEmergent', langCode)}</option>
                <option value="mastery">{getUIText('tierMastery', langCode)}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950">
          {onDelete && (
            <button
              type="button"
              onClick={() => {
                onDelete(tile.id);
                onClose();
              }}
              className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 p-2 rounded-xl hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Tile</span>
            </button>
          )}

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
              className="px-5 py-2 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-transform active:scale-95"
            >
              {getUIText('saveChanges', langCode)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
