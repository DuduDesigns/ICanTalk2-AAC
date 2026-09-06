import { AACTile, CaregiverSettings, SpokenHistoryItem, ProfileBackupData } from '../types';
import { INITIAL_TILES } from '../data/initialTiles';

const STORAGE_KEYS = {
  SETTINGS: 'talktile_aac_settings_v1',
  TILES: 'talktile_aac_tiles_v1',
  HISTORY: 'talktile_aac_history_v1',
  LANGUAGE: 'talktile_aac_selected_language_v1',
};

export const DEFAULT_SETTINGS: CaregiverSettings = {
  pin: '1234',
  childLockEnabled: false,
  currentTier: 'emergent',
  gridDensityMastery: '4x4',
  contrastMode: 'standard',
  speechRate: 1.0,
  speechPitch: 1.0,
  speechVolume: 1.0,
  preferredVoiceURI: '',
  aiGrammarEnabled: true,
  soundEffectsEnabled: true,
  hapticsEnabled: true,
  emergencyContactName: 'Caregiver / Family',
  emergencyContactPhone: '911 / Local Emergency',
  emergencyNote: 'User uses ICanTalk2 AAC for functional speech communication.',
  autoSpeakOnTap: true,
  clearAfterSpeak: false,
};

export class StorageService {
  // Settings
  public getSettings(): CaregiverSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse settings from storage:', e);
    }
    return { ...DEFAULT_SETTINGS };
  }

  public saveSettings(settings: CaregiverSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to storage:', e);
    }
  }

  // Tiles
  public getTiles(): AACTile[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TILES);
      if (stored) {
        const parsed: AACTile[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t) => ({
            ...t,
            semanticKey: t.semanticKey || t.id.replace(/-/g, '_'),
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to parse custom tiles from storage:', e);
    }
    return [...INITIAL_TILES];
  }

  public saveTiles(tiles: AACTile[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TILES, JSON.stringify(tiles));
    } catch (e) {
      console.warn('Failed to save tiles to storage:', e);
    }
  }

  public resetTilesToDefault(): AACTile[] {
    try {
      localStorage.removeItem(STORAGE_KEYS.TILES);
    } catch {
      // ignore
    }
    return [...INITIAL_TILES];
  }

  // Selected Language
  public getSelectedLanguage(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en-US';
    } catch {
      return 'en-US';
    }
  }

  public saveSelectedLanguage(langCode: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, langCode);
    } catch {
      // ignore
    }
  }

  // Spoken History
  public getHistory(): SpokenHistoryItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  }

  public addHistoryItem(item: Omit<SpokenHistoryItem, 'id' | 'timestamp'>): SpokenHistoryItem {
    const history = this.getHistory();
    const newItem: SpokenHistoryItem = {
      ...item,
      id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now(),
    };
    // Keep last 150 items
    const updated = [newItem, ...history.filter(h => h.fullSentence !== item.fullSentence)].slice(0, 150);
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return newItem;
  }

  public toggleFavoriteHistory(id: string): SpokenHistoryItem[] {
    const history = this.getHistory();
    const updated = history.map(item => {
      if (item.id === id) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    });
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  }

  public clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch {
      // ignore
    }
  }

  // Export / Import Profile JSON
  public exportProfileJSON(): string {
    const data: ProfileBackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      customTiles: this.getTiles(),
      history: this.getHistory(),
      selectedLanguage: this.getSelectedLanguage(),
    };
    return JSON.stringify(data, null, 2);
  }

  public importProfileJSON(jsonString: string): ProfileBackupData {
    const data = JSON.parse(jsonString) as ProfileBackupData;
    if (!data || !data.settings || !Array.isArray(data.customTiles)) {
      throw new Error('Invalid profile backup file format.');
    }
    this.saveSettings(data.settings);
    this.saveTiles(data.customTiles);
    if (Array.isArray(data.history)) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data.history));
    }
    if (data.selectedLanguage) {
      this.saveSelectedLanguage(data.selectedLanguage);
    }
    return data;
  }
}

export const storageService = new StorageService();
