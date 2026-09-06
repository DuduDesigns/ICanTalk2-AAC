import React, { useEffect, useState, useRef } from 'react';
import { CaregiverSettings } from '../types';
import { getUIText } from '../data/languages';
import { ttsService } from '../services/ttsService';
import { AlertTriangle, Phone, Volume2, X, BellOff, BellRing, HeartPulse } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  settings: CaregiverSettings;
  langCode: string;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  settings,
  langCode,
  onClose,
}) => {
  const [sirenActive, setSirenActive] = useState(true);
  const stopSirenRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isOpen) {
      // 1. Speak emergency message immediately
      const emergencyMessage =
        langCode.startsWith('hu')
          ? 'Segítség! Rosszul vagyok, orvosi segítségre van szükségem.'
          : langCode.startsWith('es')
          ? '¡Ayuda! Me siento mal y necesito asistencia urgente.'
          : 'Help me! I feel sick and need immediate assistance.';

      ttsService.speakText(emergencyMessage, {
        langCode,
        rate: 1.0,
        pitch: 1.1,
        volume: 1.0,
      });

      // 2. Play siren sound
      if (sirenActive) {
        stopSirenRef.current = ttsService.playEmergencySiren();
      }
    }

    return () => {
      if (stopSirenRef.current) {
        stopSirenRef.current();
        stopSirenRef.current = null;
      }
    };
  }, [isOpen, langCode]);

  const toggleSiren = () => {
    if (sirenActive) {
      if (stopSirenRef.current) {
        stopSirenRef.current();
        stopSirenRef.current = null;
      }
      setSirenActive(false);
    } else {
      stopSirenRef.current = ttsService.playEmergencySiren();
      setSirenActive(true);
    }
  };

  const handleDismiss = () => {
    if (stopSirenRef.current) {
      stopSirenRef.current();
      stopSirenRef.current = null;
    }
    ttsService.stop();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border-4 border-red-600 overflow-hidden flex flex-col">
        {/* Urgent Flashing Header */}
        <div className="p-6 bg-red-600 text-white text-center flex flex-col items-center gap-2">
          <AlertTriangle className="w-16 h-16 text-yellow-300 animate-bounce" />
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            EMERGENCY ALERT / SEGÍTSÉG
          </h2>
          <p className="text-sm font-semibold opacity-95">
            Immediate Attention Requested by Communicator
          </p>
        </div>

        {/* Emergency Info Body */}
        <div className="p-6 space-y-5">
          {/* Siren Control Button */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={toggleSiren}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm shadow-md transition-all active:scale-95 ${
                sirenActive
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-slate-200 dark:bg-neutral-800 text-slate-800 dark:text-white'
              }`}
            >
              {sirenActive ? <BellRing className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
              <span>{sirenActive ? 'Siren Alarm Active (Tap to Silence)' : 'Sound Alarm (Tap to Start)'}</span>
            </button>
          </div>

          {/* Emergency Contact */}
          <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-800 space-y-2">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold text-sm">
              <Phone className="w-4 h-4" />
              <span>Emergency Caregiver Contact:</span>
            </div>
            <p className="text-base font-extrabold text-slate-900 dark:text-white">
              {settings.emergencyContactName} : {settings.emergencyContactPhone}
            </p>
          </div>

          {/* Medical Notes */}
          {settings.emergencyNote && (
            <div className="p-4 bg-slate-50 dark:bg-neutral-800 rounded-2xl border border-slate-200 dark:border-neutral-700 space-y-1">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <span>Medical & AAC Note:</span>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                {settings.emergencyNote}
              </p>
            </div>
          )}

          {/* Re-Speak Emergency Audio */}
          <button
            type="button"
            onClick={() => {
              const emergencyMessage =
                langCode.startsWith('hu')
                  ? 'Segítség! Rosszul vagyok, orvosi segítségre van szükségem.'
                  : 'Help me! I feel sick and need immediate assistance.';
              ttsService.speakText(emergencyMessage, { langCode });
            }}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 font-bold text-sm text-slate-800 dark:text-white flex items-center justify-center gap-2"
          >
            <Volume2 className="w-5 h-5 text-blue-600" />
            <span>Re-Speak Vocal Emergency Broadcast</span>
          </button>
        </div>

        {/* Footer with Dismiss Button */}
        <div className="p-4 border-t border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 flex justify-end">
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-3.5 rounded-2xl font-black text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-transform active:scale-95"
          >
            Dismiss Alert / Situation Resolved
          </button>
        </div>
      </div>
    </div>
  );
};
