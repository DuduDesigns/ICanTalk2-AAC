// Text-to-Speech and Audio Synthesizer Service

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private audioCtx: AudioContext | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  public getVoicesForLanguage(langCode: string): SpeechSynthesisVoice[] {
    if (!this.voices.length && this.synth) {
      this.voices = this.synth.getVoices();
    }
    const prefix = langCode.split('-')[0].toLowerCase();
    return this.voices.filter(
      (v) => v.lang.toLowerCase().startsWith(prefix) || v.lang.toLowerCase().includes(prefix)
    );
  }

  public getAllVoices(): SpeechSynthesisVoice[] {
    if (!this.voices.length && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  /**
   * Speaks text using Web Speech API with fine-tuned rate, pitch, and voice matching.
   * Calls onWordBoundary with current word index when supported by the browser engine.
   */
  public speakText(
    text: string,
    options: {
      langCode: string;
      rate?: number;
      pitch?: number;
      volume?: number;
      voiceURI?: string;
      onStart?: () => void;
      onEnd?: () => void;
      onWordBoundary?: (charIndex: number, wordLength?: number) => void;
    }
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        options.onEnd?.();
        resolve();
        return;
      }

      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate ?? 1.0;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;
      utterance.lang = options.langCode || 'en-US';

      // Pick preferred or matched voice
      const availableVoices = this.getVoicesForLanguage(options.langCode);
      if (options.voiceURI) {
        const matched = this.voices.find((v) => v.voiceURI === options.voiceURI);
        if (matched) utterance.voice = matched;
      } else if (availableVoices.length > 0) {
        // Prefer local or high quality default voice
        const preferred =
          availableVoices.find((v) => v.default) ||
          availableVoices.find((v) => v.localService) ||
          availableVoices[0];
        utterance.voice = preferred;
      }

      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        options.onEnd?.();
        resolve();
      };

      utterance.onboundary = (e) => {
        if (e.name === 'word') {
          options.onWordBoundary?.(e.charIndex, e.charLength);
        }
      };

      this.synth.speak(utterance);
    });
  }

  /**
   * Plays a recorded human voice clip from DataURL / Blob URL
   */
  public playAudioClip(audioBase64OrUrl: string): Promise<void> {
    return new Promise((resolve) => {
      this.stop();
      try {
        const audio = new Audio(audioBase64OrUrl);
        this.currentAudioElement = audio;
        audio.onended = () => {
          this.currentAudioElement = null;
          resolve();
        };
        audio.onerror = () => {
          this.currentAudioElement = null;
          resolve();
        };
        audio.play().catch(() => resolve());
      } catch (err) {
        console.warn('Audio clip playback failed:', err);
        resolve();
      }
    });
  }

  /**
   * Stops all active speech synthesis and audio playback
   */
  public stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
  }

  /**
   * Generates a soft tactile audio feedback beep/chime on tile press
   */
  public playFeedbackClick(enabled: boolean = true) {
    if (!enabled) return;
    try {
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  /**
   * Triggers Emergency Siren Alarm
   */
  public playEmergencySiren(): () => void {
    try {
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

      const now = this.audioCtx.currentTime;
      // Siren frequency modulation
      for (let i = 0; i < 10; i++) {
        osc.frequency.setValueAtTime(600, now + i * 0.4);
        osc.frequency.linearRampToValueAtTime(950, now + i * 0.4 + 0.2);
        osc.frequency.linearRampToValueAtTime(600, now + i * 0.4 + 0.4);
      }

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();

      return () => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      };
    } catch {
      return () => {};
    }
  }

  /**
   * Tactile Haptic Vibration trigger
   */
  public triggerHaptic(enabled: boolean = true, durationMs: number = 25) {
    if (!enabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(durationMs);
      } catch {
        // ignore
      }
    }
  }
}

export const ttsService = new TTSService();
