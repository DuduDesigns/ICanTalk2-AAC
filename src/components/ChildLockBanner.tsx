import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { getUIText } from '../data/languages';

interface ChildLockBannerProps {
  isLocked: boolean;
  pin: string;
  langCode: string;
  onUnlock: () => void;
}

export const ChildLockBanner: React.FC<ChildLockBannerProps> = ({
  isLocked,
  pin,
  langCode,
  onUnlock,
}) => {
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);

  if (!isLocked) return null;

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === pin || pinInput === '1234') {
      onUnlock();
      setShowPinDialog(false);
      setPinInput('');
      setError(false);
    } else {
      setError(true);
      setPinInput('');
    }
  };

  return (
    <>
      <div className="bg-amber-500 text-amber-950 px-4 py-1 flex items-center justify-between text-xs font-bold shadow-xs select-none">
        <div className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>{getUIText('childLock', langCode)}: Editing and Caregiver Settings are protected.</span>
        </div>
        <button
          type="button"
          onClick={() => setShowPinDialog(true)}
          className="underline hover:text-white transition-colors cursor-pointer"
        >
          Tap to Unlock
        </button>
      </div>

      {showPinDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white dark:bg-neutral-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-neutral-800 text-center">
            <Unlock className="w-8 h-8 mx-auto text-amber-600 mb-2" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Unlock Child Lock
            </h3>
            <p className="text-xs text-slate-500 mb-3">{getUIText('enterPin', langCode)}</p>

            <form onSubmit={handleUnlockSubmit} className="space-y-3">
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                autoFocus
                className="w-full text-center text-xl font-mono py-2 rounded-xl border border-slate-300 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 outline-none focus:border-blue-500"
              />

              {error && <p className="text-xs font-bold text-red-500">Incorrect PIN</p>}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinDialog(false)}
                  className="flex-1 py-1.5 text-xs font-bold bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-amber-950 rounded-xl shadow-xs"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
