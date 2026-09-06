export type FitzgeraldColor =
  | 'pronoun'     // Yellow (People/Pronouns)
  | 'verb'        // Green (Actions)
  | 'noun'        // Orange (Objects, Food, Places, Toys)
  | 'descriptor'  // Blue (Adjectives, Feelings)
  | 'social'      // Pink (Social, Politeness)
  | 'emergency'   // Red (Urgent, Panic, Medical)
  | 'preposition' // Purple (Prepositions, Questions)
  | 'custom';

export type CategoryId =
  | 'core'
  | 'actions'
  | 'food'
  | 'feelings'
  | 'places'
  | 'toys'
  | 'people'
  | 'social'
  | 'emergency';

export type ProgressionTier = 'starter' | 'emergent' | 'mastery';

export type ContrastMode = 'standard' | 'high-contrast-dark' | 'high-contrast-light' | 'yellow-on-black';

export interface AACTile {
  id: string;
  semanticKey?: string;           // Unique semantic key (e.g., 'core_want', 'core_more', 'core_help')
  label: string;                  // Display text in active language
  spokenText?: string;            // Alternate spoken pronunciation if needed
  category: CategoryId;           // Category grouping
  fitzgeraldColor: FitzgeraldColor; // Color classification
  emoji?: string;                 // Display emoji
  iconName?: string;              // Lucide icon name fallback
  customImageUrl?: string;        // Base64 or Blob URL for user uploaded image
  audioRecordedBase64?: string;   // Real human voice recording (DataURL)
  useRecordedAudio?: boolean;     // Whether to prefer custom audio over TTS
  translations?: Record<string, string>; // Language code -> translated label
  tierMin?: ProgressionTier;      // Minimum tier required to display ('starter' <= 'emergent' <= 'mastery')
  isCoreAnchor?: boolean;         // Always show in core anchor grid
  order?: number;                 // Order rank in category
  hidden?: boolean;               // Visibility toggle
}

export interface LanguageInfo {
  code: string;           // e.g. 'en-US'
  name: string;           // English
  nativeName: string;     // English, Español, Magyar, etc.
  flag: string;           // Country flag emoji
  dir: 'ltr' | 'rtl';     // Text direction
  ttsLangCode: string;    // SpeechSynthesis language identifier
}

export interface SpokenHistoryItem {
  id: string;
  timestamp: number;
  rawTokens: string[];
  fullSentence: string;
  languageCode: string;
  isFavorite?: boolean;
}

export interface CaregiverSettings {
  pin: string;                     // Caregiver PIN (default '1234')
  childLockEnabled: boolean;       // Locks editing and navigation
  currentTier: ProgressionTier;    // 'starter' (2x2), 'emergent' (2x4), 'mastery' (3x4 or 4x4)
  gridDensityMastery: '3x4' | '4x4' | '4x6'; // Mastery density
  contrastMode: ContrastMode;      // Color theme
  speechRate: number;              // 0.5 - 2.0 (default 1.0)
  speechPitch: number;             // 0.5 - 1.8 (default 1.0)
  speechVolume: number;            // 0 - 1.0 (default 1.0)
  preferredVoiceURI: string;       // Preferred TTS voice URI
  aiGrammarEnabled: boolean;       // AI sentence expansion enabled
  soundEffectsEnabled: boolean;    // Tile tap click sound
  hapticsEnabled: boolean;         // Haptic vibration
  emergencyContactName: string;    // E.g. "Mom / Dr. Sarah"
  emergencyContactPhone: string;   // E.g. "+1-555-0199"
  emergencyNote: string;           // E.g. "Allergic to peanuts. Non-verbal."
  autoSpeakOnTap: boolean;         // Speak individual tile when tapped
  clearAfterSpeak: boolean;        // Clear sentence strip after speaking full phrase
}

export interface AACCategory {
  id: CategoryId;
  nameKey: string;
  defaultName: string;
  emoji: string;
  iconName: string;
  colorClass: string;
  fitzgeraldColor: FitzgeraldColor;
}

export interface QuickPhrase {
  id: string;
  text: string;
  category: string;
  emoji: string;
  translations?: Record<string, string>;
}

export interface ProfileBackupData {
  version: number;
  exportedAt: string;
  settings: CaregiverSettings;
  customTiles: AACTile[];
  history: SpokenHistoryItem[];
  selectedLanguage: string;
}
