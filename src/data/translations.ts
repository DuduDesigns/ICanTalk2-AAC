import { AACTile, CategoryId } from '../types';

/**
 * Centralized Category Translations for all 9 core AAC categories across all 18 supported languages.
 */
export const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  core: {
    'en-US': 'Core Vocabulary',
    'hu-HU': 'Alapszókincs',
    'es-ES': 'Vocabulario básico',
    'ar-SA': 'المفردات الأساسية',
    'fr-FR': 'Vocabulaire de base',
    'de-DE': 'Kernwortschatz',
    'ja-JP': 'コア語彙',
    'pt-BR': 'Vocabulário básico',
    'it-IT': 'Vocabolario di base',
    'hi-IN': 'मुख्य शब्दावली',
    'zh-CN': '核心词汇',
    'ko-KR': '핵심 어휘',
    'ru-RU': 'Базовый словарь',
    'nl-NL': 'Kernwoorden',
    'pl-PL': 'Słownictwo podstawowe',
    'tr-TR': 'Temel Kelimeler',
    'vi-VN': 'Từ vựng cốt lõi',
    'tl-PH': 'Pangunahing Salita',
  },
  actions: {
    'en-US': 'Actions',
    'hu-HU': 'Cselekvések',
    'es-ES': 'Acciones',
    'ar-SA': 'أفعال',
    'fr-FR': 'Actions',
    'de-DE': 'Aktionen',
    'ja-JP': '動作・行動',
    'pt-BR': 'Ações',
    'it-IT': 'Azioni',
    'hi-IN': 'क्रियाएं',
    'zh-CN': '动作',
    'ko-KR': '동작',
    'ru-RU': 'Действия',
    'nl-NL': 'Acties',
    'pl-PL': 'Czynności',
    'tr-TR': 'Eylemler',
    'vi-VN': 'Hành động',
    'tl-PH': 'Mga Kilos',
  },
  food: {
    'en-US': 'Food & Drink',
    'hu-HU': 'Ételek és italok',
    'es-ES': 'Comida y bebida',
    'ar-SA': 'طعام وشراب',
    'fr-FR': 'Nourriture et boissons',
    'de-DE': 'Essen & Trinken',
    'ja-JP': '食べ物と飲み物',
    'pt-BR': 'Comida e bebida',
    'it-IT': 'Cibo e bevande',
    'hi-IN': 'भोजन और पेय',
    'zh-CN': '食物与饮料',
    'ko-KR': '음식과 음료',
    'ru-RU': 'Еда и напитки',
    'nl-NL': 'Eten & Drinken',
    'pl-PL': 'Jedzenie i picie',
    'tr-TR': 'Yiyecek ve İçecek',
    'vi-VN': 'Đồ ăn & Thức uống',
    'tl-PH': 'Pagkain at Inumin',
  },
  feelings: {
    'en-US': 'Feelings',
    'hu-HU': 'Érzések',
    'es-ES': 'Sentimientos',
    'ar-SA': 'مشاعر',
    'fr-FR': 'Sentiments',
    'de-DE': 'Gefühle',
    'ja-JP': '気持ち・感情',
    'pt-BR': 'Sentimentos',
    'it-IT': 'Emozioni',
    'hi-IN': 'भावनाएं',
    'zh-CN': '感受与情绪',
    'ko-KR': '감정과 기분',
    'ru-RU': 'Чувства и эмоции',
    'nl-NL': 'Gevoelens',
    'pl-PL': 'Uczucia',
    'tr-TR': 'Duygular',
    'vi-VN': 'Cảm xúc',
    'tl-PH': 'Damdamin',
  },
  places: {
    'en-US': 'Places',
    'hu-HU': 'Helyek',
    'es-ES': 'Lugares',
    'ar-SA': 'أماكن',
    'fr-FR': 'Lieux',
    'de-DE': 'Orte',
    'ja-JP': '場所',
    'pt-BR': 'Lugares',
    'it-IT': 'Luoghi',
    'hi-IN': 'स्थान',
    'zh-CN': '地点',
    'ko-KR': '장소',
    'ru-RU': 'Места',
    'nl-NL': 'Plaatsen',
    'pl-PL': 'Miejsca',
    'tr-TR': 'Yerler',
    'vi-VN': 'Địa điểm',
    'tl-PH': 'Mga Lugar',
  },
  toys: {
    'en-US': 'Toys & Play',
    'hu-HU': 'Játékok',
    'es-ES': 'Juguetes y juegos',
    'ar-SA': 'ألعاب وتسلية',
    'fr-FR': 'Jouets et jeux',
    'de-DE': 'Spielzeug & Spiele',
    'ja-JP': 'おもちゃ・遊び',
    'pt-BR': 'Brinquedos e jogos',
    'it-IT': 'Giocattoli e giochi',
    'hi-IN': 'खिलौने और खेल',
    'zh-CN': '玩具与游戏',
    'ko-KR': '장난감과 놀이',
    'ru-RU': 'Игрушки и игры',
    'nl-NL': 'Speelgoed',
    'pl-PL': 'Zabawki i gry',
    'tr-TR': 'Oyuncaklar ve Oyun',
    'vi-VN': 'Đồ chơi & Trò chơi',
    'tl-PH': 'Laruan at Laro',
  },
  people: {
    'en-US': 'People',
    'hu-HU': 'Emberek',
    'es-ES': 'Personas',
    'ar-SA': 'أشخاص',
    'fr-FR': 'Personnes',
    'de-DE': 'Personen',
    'ja-JP': '人・家族',
    'pt-BR': 'Pessoas',
    'it-IT': 'Persone',
    'hi-IN': 'लोग',
    'zh-CN': '人物',
    'ko-KR': '사람',
    'ru-RU': 'Люди',
    'nl-NL': 'Mensen',
    'pl-PL': 'Ludzie',
    'tr-TR': 'Kişiler',
    'vi-VN': 'Mọi người',
    'tl-PH': 'Mga Tao',
  },
  social: {
    'en-US': 'Social & Polite',
    'hu-HU': 'Udvariasság és társas',
    'es-ES': 'Social y cortesía',
    'ar-SA': 'عبارات اجتماعية',
    'fr-FR': 'Formules sociales',
    'de-DE': 'Höflichkeit & Soziales',
    'ja-JP': 'あいさつ・日常会話',
    'pt-BR': 'Social e cortesia',
    'it-IT': 'Sociale e cortesia',
    'hi-IN': 'सामाजिक और शिष्टाचार',
    'zh-CN': '社交与礼貌',
    'ko-KR': '인사와 사회성',
    'ru-RU': 'Вежливость и общение',
    'nl-NL': 'Sociaal & Beleefd',
    'pl-PL': 'Zwroty grzecznościowe',
    'tr-TR': 'Sosyal ve Nezaket',
    'vi-VN': 'Xã giao & Lịch sự',
    'tl-PH': 'Panlipunan at Magalang',
  },
  emergency: {
    'en-US': 'Emergency & Alert',
    'hu-HU': 'Vészhelyzet és riasztás',
    'es-ES': 'Emergencia y alerta',
    'ar-SA': 'طوارئ وإنذار',
    'fr-FR': 'Urgence et alerte',
    'de-DE': 'Notfall & Alarm',
    'ja-JP': '緊急・アラート',
    'pt-BR': 'Emergência e alerta',
    'it-IT': 'Emergenza e allarme',
    'hi-IN': 'आपातकाल और चेतावनी',
    'zh-CN': '紧急呼救与警报',
    'ko-KR': '긴급상황 및 경보',
    'ru-RU': 'Экстренная помощь',
    'nl-NL': 'Noodgeval & Alarm',
    'pl-PL': 'Nagły wypadek i alert',
    'tr-TR': 'Acil Durum ve Alarm',
    'vi-VN': 'Khẩn cấp & Báo động',
    'tl-PH': 'Emerhensiya at Alerto',
  },
};

/**
 * Returns localized category title.
 */
export function getCategoryTitle(categoryId: CategoryId | string, langCode: string): string {
  const normalizedKey = categoryId.toLowerCase();
  const translations = CATEGORY_TRANSLATIONS[normalizedKey];
  if (translations) {
    return translations[langCode] || translations['en-US'] || categoryId;
  }
  return categoryId;
}

/**
 * Centralized Semantic Key Translation Dictionary for All Standard AAC Tiles.
 * Supports both underscore semantic keys (e.g. 'core_want') and dash IDs (e.g. 'core-want').
 */
export const TILE_TRANSLATIONS: Record<string, Record<string, string>> = {
  // === CORE VOCABULARY ===
  core_i: {
    'en-US': 'I / Me', 'hu-HU': 'Én / Nekem', 'es-ES': 'Yo / Me', 'ar-SA': 'أنا',
    'fr-FR': 'Moi / Je', 'de-DE': 'Ich / Mich', 'ja-JP': 'わたし', 'pt-BR': 'Eu / Mim',
    'it-IT': 'Io / Me', 'hi-IN': 'मैं / मुझे', 'zh-CN': '我', 'ko-KR': '나 / 저',
    'ru-RU': 'Я / Мне', 'nl-NL': 'Ik / Mij', 'pl-PL': 'Ja / Mnie', 'tr-TR': 'Ben / Bana',
    'vi-VN': 'Tôi', 'tl-PH': 'Ako',
  },
  core_want: {
    'en-US': 'Want', 'hu-HU': 'Kérek / Akarom', 'es-ES': 'Quiero', 'ar-SA': 'أريد',
    'fr-FR': 'Je veux', 'de-DE': 'Möchte / Will', 'ja-JP': 'ほしい', 'pt-BR': 'Quero',
    'it-IT': 'Voglio', 'hi-IN': 'चाहिए', 'zh-CN': '想要', 'ko-KR': '원해요',
    'ru-RU': 'Хочу', 'nl-NL': 'Wil', 'pl-PL': 'Chcę', 'tr-TR': 'İstiyorum',
    'vi-VN': 'Muốn', 'tl-PH': 'Gusto ko',
  },
  core_more: {
    'en-US': 'More', 'hu-HU': 'Még / Többet', 'es-ES': 'Más', 'ar-SA': 'المزيد',
    'fr-FR': 'Encore', 'de-DE': 'Mehr', 'ja-JP': 'もっと', 'pt-BR': 'Mais',
    'it-IT': 'Di più / Ancora', 'hi-IN': 'और', 'zh-CN': '还要', 'ko-KR': '더',
    'ru-RU': 'Ещё', 'nl-NL': 'Meer', 'pl-PL': 'Więcej', 'tr-TR': 'Daha fazla',
    'vi-VN': 'Thêm', 'tl-PH': 'Isa pa / Higit pa',
  },
  core_stop: {
    'en-US': 'Stop', 'hu-HU': 'Állj / Elég', 'es-ES': 'Parar', 'ar-SA': 'توقف',
    'fr-FR': 'Arrête', 'de-DE': 'Stopp', 'ja-JP': 'やめて', 'pt-BR': 'Parar',
    'it-IT': 'Basta / Stop', 'hi-IN': 'रुकें', 'zh-CN': '停 / 停止', 'ko-KR': '그만 / 멈춰',
    'ru-RU': 'Хватит / Стоп', 'nl-NL': 'Stop', 'pl-PL': 'Stop', 'tr-TR': 'Dur',
    'vi-VN': 'Dừng lại', 'tl-PH': 'Hinto',
  },
  core_help: {
    'en-US': 'Help', 'hu-HU': 'Segíts', 'es-ES': 'Ayuda', 'ar-SA': 'مساعدة',
    'fr-FR': 'Aide', 'de-DE': 'Hilfe', 'ja-JP': 'たすけて', 'pt-BR': 'Ajuda',
    'it-IT': 'Aiuto', 'hi-IN': 'मदद', 'zh-CN': '帮助', 'ko-KR': '도와주세요',
    'ru-RU': 'Помощь', 'nl-NL': 'Help', 'pl-PL': 'Pomoc', 'tr-TR': 'Yardım',
    'vi-VN': 'Giúp đỡ', 'tl-PH': 'Tulong',
  },
  core_like: {
    'en-US': 'Like', 'hu-HU': 'Szeretem / Tetszik', 'es-ES': 'Me gusta', 'ar-SA': 'يعجبني',
    'fr-FR': 'J’aime', 'de-DE': 'Mag', 'ja-JP': 'すき', 'pt-BR': 'Gosto',
    'it-IT': 'Mi piace', 'hi-IN': 'पसंद है', 'zh-CN': '喜欢', 'ko-KR': '좋아해요',
    'ru-RU': 'Нравится', 'nl-NL': 'Leuk', 'pl-PL': 'Lubię', 'tr-TR': 'Beğendim',
    'vi-VN': 'Thích', 'tl-PH': 'Gusto ko',
  },
  core_yes: {
    'en-US': 'Yes', 'hu-HU': 'Igen', 'es-ES': 'Sí', 'ar-SA': 'نعم',
    'fr-FR': 'Oui', 'de-DE': 'Ja', 'ja-JP': 'はい', 'pt-BR': 'Sim',
    'it-IT': 'Sì', 'hi-IN': 'हाँ', 'zh-CN': '是的', 'ko-KR': '네',
    'ru-RU': 'Да', 'nl-NL': 'Ja', 'pl-PL': 'Tak', 'tr-TR': 'Evet',
    'vi-VN': 'Có / Đúng', 'tl-PH': 'Oo',
  },
  core_no: {
    'en-US': 'No', 'hu-HU': 'Nem', 'es-ES': 'No', 'ar-SA': 'لا',
    'fr-FR': 'Non', 'de-DE': 'Nein', 'ja-JP': 'いいえ', 'pt-BR': 'Não',
    'it-IT': 'No', 'hi-IN': 'नहीं', 'zh-CN': '不要 / 不是', 'ko-KR': '아니오',
    'ru-RU': 'Нет', 'nl-NL': 'Nee', 'pl-PL': 'Nie', 'tr-TR': 'Hayır',
    'vi-VN': 'Không', 'tl-PH': 'Hindi',
  },
  core_go: {
    'en-US': 'Go', 'hu-HU': 'Megyünk', 'es-ES': 'Ir', 'ar-SA': 'اذهب',
    'fr-FR': 'Aller', 'de-DE': 'Gehen', 'ja-JP': 'いく', 'pt-BR': 'Ir',
    'it-IT': 'Andare', 'hi-IN': 'जाना', 'zh-CN': '去 / 走', 'ko-KR': '가요',
    'ru-RU': 'Идти', 'nl-NL': 'Gaan', 'pl-PL': 'Iść', 'tr-TR': 'Git',
    'vi-VN': 'Đi', 'tl-PH': 'Pumunta',
  },
  core_look: {
    'en-US': 'Look', 'hu-HU': 'Nézd', 'es-ES': 'Mira', 'ar-SA': 'انظر',
    'fr-FR': 'Regarde', 'de-DE': 'Schau', 'ja-JP': 'みて', 'pt-BR': 'Olhe',
    'it-IT': 'Guarda', 'hi-IN': 'देखो', 'zh-CN': '看', 'ko-KR': '봐요',
    'ru-RU': 'Смотри', 'nl-NL': 'Kijk', 'pl-PL': 'Patrz', 'tr-TR': 'Bak',
    'vi-VN': 'Nhìn', 'tl-PH': 'Tingnan',
  },
  core_please: {
    'en-US': 'Please', 'hu-HU': 'Kérem / Légy szíves', 'es-ES': 'Por favor', 'ar-SA': 'من فضلك',
    'fr-FR': 'S’il te plaît', 'de-DE': 'Bitte', 'ja-JP': 'おねがい', 'pt-BR': 'Por favor',
    'it-IT': 'Per favore', 'hi-IN': 'कृपया', 'zh-CN': '请', 'ko-KR': '부탁해요',
    'ru-RU': 'Пожалуйста', 'nl-NL': 'Alstublieft', 'pl-PL': 'Proszę', 'tr-TR': 'Lütfen',
    'vi-VN': 'Làm ơn', 'tl-PH': 'Pakiusap',
  },
  core_thanks: {
    'en-US': 'Thank You', 'hu-HU': 'Köszönöm', 'es-ES': 'Gracias', 'ar-SA': 'شكراً',
    'fr-FR': 'Merci', 'de-DE': 'Danke', 'ja-JP': 'ありがとう', 'pt-BR': 'Obrigado',
    'it-IT': 'Grazie', 'hi-IN': 'धन्यवाद', 'zh-CN': '谢谢', 'ko-KR': '감사합니다',
    'ru-RU': 'Спасибо', 'nl-NL': 'Dank je', 'pl-PL': 'Dziękuję', 'tr-TR': 'Teşekkürler',
    'vi-VN': 'Cảm ơn', 'tl-PH': 'Salamat',
  },

  // === ACTIONS ===
  act_eat: {
    'en-US': 'Eat', 'hu-HU': 'Enni', 'es-ES': 'Comer', 'ar-SA': 'أكل',
    'fr-FR': 'Manger', 'de-DE': 'Essen', 'ja-JP': 'たべる', 'pt-BR': 'Comer',
    'it-IT': 'Mangiare', 'hi-IN': 'खाना', 'zh-CN': '吃', 'ko-KR': '먹다',
    'ru-RU': 'Кушать', 'nl-NL': 'Eten', 'pl-PL': 'Jeść', 'tr-TR': 'Yemek',
    'vi-VN': 'Ăn', 'tl-PH': 'Kumain',
  },
  act_drink: {
    'en-US': 'Drink', 'hu-HU': 'Inni', 'es-ES': 'Beber', 'ar-SA': 'شرب',
    'fr-FR': 'Boire', 'de-DE': 'Trinken', 'ja-JP': 'のむ', 'pt-BR': 'Beber',
    'it-IT': 'Bere', 'hi-IN': 'पीना', 'zh-CN': '喝', 'ko-KR': '마시다',
    'ru-RU': 'Пить', 'nl-NL': 'Drinken', 'pl-PL': 'Pić', 'tr-TR': 'İçmek',
    'vi-VN': 'Uống', 'tl-PH': 'Uminom',
  },
  act_play: {
    'en-US': 'Play', 'hu-HU': 'Játszani', 'es-ES': 'Jugar', 'ar-SA': 'يلعب',
    'fr-FR': 'Jouer', 'de-DE': 'Spielen', 'ja-JP': 'あそぶ', 'pt-BR': 'Brincar',
    'it-IT': 'Giocare', 'hi-IN': 'खेलना', 'zh-CN': '玩耍', 'ko-KR': '놀다',
    'ru-RU': 'Играть', 'nl-NL': 'Spelen', 'pl-PL': 'Bawić się', 'tr-TR': 'Oynamak',
    'vi-VN': 'Chơi', 'tl-PH': 'Maglaro',
  },
  act_sleep: {
    'en-US': 'Sleep', 'hu-HU': 'Aludni', 'es-ES': 'Dormir', 'ar-SA': 'نوم',
    'fr-FR': 'Dormir', 'de-DE': 'Schlafen', 'ja-JP': 'ねる', 'pt-BR': 'Dormir',
    'it-IT': 'Dormire', 'hi-IN': 'सोना', 'zh-CN': '睡觉', 'ko-KR': '자다',
    'ru-RU': 'Спать', 'nl-NL': 'Slapen', 'pl-PL': 'Spać', 'tr-TR': 'Uyumak',
    'vi-VN': 'Ngủ', 'tl-PH': 'Matulog',
  },
  act_watch: {
    'en-US': 'Watch', 'hu-HU': 'Nézni', 'es-ES': 'Mirar / Ver', 'ar-SA': 'مشاهدة',
    'fr-FR': 'Regarder', 'de-DE': 'Schauen', 'ja-JP': 'みる', 'pt-BR': 'Assistir',
    'it-IT': 'Guardare', 'hi-IN': 'देखना', 'zh-CN': '观看', 'ko-KR': '보다',
    'ru-RU': 'Смотреть', 'nl-NL': 'Kijken', 'pl-PL': 'Oglądać', 'tr-TR': 'İzlemek',
    'vi-VN': 'Xem', 'tl-PH': 'Manood',
  },
  act_read: {
    'en-US': 'Read', 'hu-HU': 'Olvasni', 'es-ES': 'Leer', 'ar-SA': 'قراءة',
    'fr-FR': 'Lire', 'de-DE': 'Lesen', 'ja-JP': 'よむ', 'pt-BR': 'Ler',
    'it-IT': 'Leggere', 'hi-IN': 'पढ़ना', 'zh-CN': '阅读', 'ko-KR': '읽다',
    'ru-RU': 'Читать', 'nl-NL': 'Lezen', 'pl-PL': 'Czytać', 'tr-TR': 'Okumak',
    'vi-VN': 'Đọc', 'tl-PH': 'Magbasa',
  },
  act_listen: {
    'en-US': 'Listen', 'hu-HU': 'Hallgatni', 'es-ES': 'Escuchar', 'ar-SA': 'استماع',
    'fr-FR': 'Écouter', 'de-DE': 'Hören', 'ja-JP': 'きく', 'pt-BR': 'Ouvir',
    'it-IT': 'Ascoltare', 'hi-IN': 'सुनना', 'zh-CN': '听音乐', 'ko-KR': '듣다',
    'ru-RU': 'Слушать', 'nl-NL': 'Luisteren', 'pl-PL': 'Słuchać', 'tr-TR': 'Dinlemek',
    'vi-VN': 'Nghe', 'tl-PH': 'Makinig',
  },
  act_wash: {
    'en-US': 'Wash', 'hu-HU': 'Mosni', 'es-ES': 'Lavar', 'ar-SA': 'غسل',
    'fr-FR': 'Laver', 'de-DE': 'Waschen', 'ja-JP': 'あらう', 'pt-BR': 'Lavar',
    'it-IT': 'Lavare', 'hi-IN': 'धोना', 'zh-CN': '洗', 'ko-KR': '씻다',
    'ru-RU': 'Мыть', 'nl-NL': 'Wassen', 'pl-PL': 'Myć', 'tr-TR': 'Yıkamak',
    'vi-VN': 'Rửa', 'tl-PH': 'Maghugas',
  },
  act_open: {
    'en-US': 'Open', 'hu-HU': 'Kinyitni', 'es-ES': 'Abrir', 'ar-SA': 'فتح',
    'fr-FR': 'Ouvrir', 'de-DE': 'Öffnen', 'ja-JP': 'あける', 'pt-BR': 'Abrir',
    'it-IT': 'Aprire', 'hi-IN': 'खोलना', 'zh-CN': '开', 'ko-KR': '열다',
    'ru-RU': 'Открыть', 'nl-NL': 'Openen', 'pl-PL': 'Otworzyć', 'tr-TR': 'Açmak',
    'vi-VN': 'Mở', 'tl-PH': 'Buksan',
  },
  act_close: {
    'en-US': 'Close', 'hu-HU': 'Becsukni', 'es-ES': 'Cerrar', 'ar-SA': 'إغلاق',
    'fr-FR': 'Fermer', 'de-DE': 'Schließen', 'ja-JP': 'しめる', 'pt-BR': 'Fechar',
    'it-IT': 'Chiudere', 'hi-IN': 'बंद करना', 'zh-CN': '关', 'ko-KR': '닫다',
    'ru-RU': 'Закрыть', 'nl-NL': 'Sluiten', 'pl-PL': 'Zamknąć', 'tr-TR': 'Kapatmak',
    'vi-VN': 'Đóng', 'tl-PH': 'Isara',
  },

  // === FOOD & DRINK ===
  food_water: {
    'en-US': 'Water', 'hu-HU': 'Víz', 'es-ES': 'Agua', 'ar-SA': 'ماء',
    'fr-FR': 'Eau', 'de-DE': 'Wasser', 'ja-JP': 'おみず', 'pt-BR': 'Água',
    'it-IT': 'Acqua', 'hi-IN': 'पानी', 'zh-CN': '水', 'ko-KR': '물',
    'ru-RU': 'Вода', 'nl-NL': 'Water', 'pl-PL': 'Woda', 'tr-TR': 'Su',
    'vi-VN': 'Nước', 'tl-PH': 'Tubig',
  },
  food_apple: {
    'en-US': 'Apple', 'hu-HU': 'Alma', 'es-ES': 'Manzana', 'ar-SA': 'تفاحة',
    'fr-FR': 'Pomme', 'de-DE': 'Apfel', 'ja-JP': 'りんご', 'pt-BR': 'Maçã',
    'it-IT': 'Mela', 'hi-IN': 'सेब', 'zh-CN': '苹果', 'ko-KR': '사과',
    'ru-RU': 'Яблоко', 'nl-NL': 'Appel', 'pl-PL': 'Jabłko', 'tr-TR': 'Elma',
    'vi-VN': 'Quả táo', 'tl-PH': 'Mansanas',
  },
  food_milk: {
    'en-US': 'Milk', 'hu-HU': 'Tej', 'es-ES': 'Leche', 'ar-SA': 'حليب',
    'fr-FR': 'Lait', 'de-DE': 'Milch', 'ja-JP': 'ぎゅうにゅう', 'pt-BR': 'Leite',
    'it-IT': 'Latte', 'hi-IN': 'दूध', 'zh-CN': '牛奶', 'ko-KR': '우유',
    'ru-RU': 'Молоко', 'nl-NL': 'Melk', 'pl-PL': 'Mleko', 'tr-TR': 'Süt',
    'vi-VN': 'Sữa', 'tl-PH': 'Gatas',
  },
  food_juice: {
    'en-US': 'Juice', 'hu-HU': 'Gyümölcslé', 'es-ES': 'Jugo', 'ar-SA': 'عصير',
    'fr-FR': 'Jus', 'de-DE': 'Saft', 'ja-JP': 'ジュース', 'pt-BR': 'Suco',
    'it-IT': 'Succo', 'hi-IN': 'रस', 'zh-CN': '果汁', 'ko-KR': '주스',
    'ru-RU': 'Сок', 'nl-NL': 'Sap', 'pl-PL': 'Sok', 'tr-TR': 'Meyve suyu',
    'vi-VN': 'Nước trái cây', 'tl-PH': 'Juice',
  },
  food_bread: {
    'en-US': 'Bread', 'hu-HU': 'Kenyér', 'es-ES': 'Pan', 'ar-SA': 'خبز',
    'fr-FR': 'Pain', 'de-DE': 'Brot', 'ja-JP': 'パン', 'pt-BR': 'Pão',
    'it-IT': 'Pane', 'hi-IN': 'रोटी', 'zh-CN': '面包', 'ko-KR': '빵',
    'ru-RU': 'Хлеб', 'nl-NL': 'Brood', 'pl-PL': 'Chleb', 'tr-TR': 'Ekmek',
    'vi-VN': 'Bánh mì', 'tl-PH': 'Tinapay',
  },
  food_pizza: {
    'en-US': 'Pizza', 'hu-HU': 'Pizza', 'es-ES': 'Pizza', 'ar-SA': 'بيتزا',
    'fr-FR': 'Pizza', 'de-DE': 'Pizza', 'ja-JP': 'ピザ', 'pt-BR': 'Pizza',
    'it-IT': 'Pizza', 'hi-IN': 'पिज़्ज़ा', 'zh-CN': '披萨', 'ko-KR': '피자',
    'ru-RU': 'Пицца', 'nl-NL': 'Pizza', 'pl-PL': 'Pizza', 'tr-TR': 'Pizza',
    'vi-VN': 'Pizza', 'tl-PH': 'Pizza',
  },
  food_banana: {
    'en-US': 'Banana', 'hu-HU': 'Banán', 'es-ES': 'Plátano', 'ar-SA': 'موز',
    'fr-FR': 'Banane', 'de-DE': 'Banane', 'ja-JP': 'バナナ', 'pt-BR': 'Banana',
    'it-IT': 'Banana', 'hi-IN': 'केला', 'zh-CN': '香蕉', 'ko-KR': '바나나',
    'ru-RU': 'Банан', 'nl-NL': 'Banaan', 'pl-PL': 'Banan', 'tr-TR': 'Muz',
    'vi-VN': 'Chuối', 'tl-PH': 'Saging',
  },
  food_cookie: {
    'en-US': 'Cookie', 'hu-HU': 'Keksz', 'es-ES': 'Galleta', 'ar-SA': 'بسكويت',
    'fr-FR': 'Biscuit', 'de-DE': 'Keks', 'ja-JP': 'クッキー', 'pt-BR': 'Biscoito',
    'it-IT': 'Biscotto', 'hi-IN': 'कुकी', 'zh-CN': '饼干', 'ko-KR': '쿠키',
    'ru-RU': 'Печенье', 'nl-NL': 'Koekje', 'pl-PL': 'Ciastko', 'tr-TR': 'Kurabiye',
    'vi-VN': 'Bánh quy', 'tl-PH': 'Biskwit',
  },

  // === FEELINGS ===
  feel_happy: {
    'en-US': 'Happy', 'hu-HU': 'Boldog', 'es-ES': 'Feliz', 'ar-SA': 'سعيد',
    'fr-FR': 'Heureux', 'de-DE': 'Glücklich', 'ja-JP': 'うれしい', 'pt-BR': 'Feliz',
    'it-IT': 'Felice', 'hi-IN': 'खुश', 'zh-CN': '开心的', 'ko-KR': '행복해요',
    'ru-RU': 'Счастливый', 'nl-NL': 'Blij', 'pl-PL': 'Szczęśliwy', 'tr-TR': 'Mutlu',
    'vi-VN': 'Vui vẻ', 'tl-PH': 'Masaya',
  },
  feel_sad: {
    'en-US': 'Sad', 'hu-HU': 'Szomorú', 'es-ES': 'Triste', 'ar-SA': 'حزين',
    'fr-FR': 'Triste', 'de-DE': 'Traurig', 'ja-JP': 'かなしい', 'pt-BR': 'Triste',
    'it-IT': 'Triste', 'hi-IN': 'उदास', 'zh-CN': '难过', 'ko-KR': '슬퍼요',
    'ru-RU': 'Грустный', 'nl-NL': 'Verdrietig', 'pl-PL': 'Smutny', 'tr-TR': 'Üzgün',
    'vi-VN': 'Buồn', 'tl-PH': 'Malungkot',
  },
  feel_tired: {
    'en-US': 'Tired', 'hu-HU': 'Fáradt', 'es-ES': 'Cansado', 'ar-SA': 'تعبان',
    'fr-FR': 'Fatigué', 'de-DE': 'Müde', 'ja-JP': 'つかれた', 'pt-BR': 'Cansado',
    'it-IT': 'Stanco', 'hi-IN': 'थका हुआ', 'zh-CN': '累了', 'ko-KR': '피곤해요',
    'ru-RU': 'Устал', 'nl-NL': 'Moe', 'pl-PL': 'Zmęczony', 'tr-TR': 'Yorgun',
    'vi-VN': 'Mệt', 'tl-PH': 'Pagod',
  },
  feel_hurt: {
    'en-US': 'Hurt / Pain', 'hu-HU': 'Fáj', 'es-ES': 'Dolor', 'ar-SA': 'مؤلم',
    'fr-FR': 'Mal', 'de-DE': 'Schmerz / Weh', 'ja-JP': 'いたい', 'pt-BR': 'Dor / Machucado',
    'it-IT': 'Male / Dolore', 'hi-IN': 'दर्द', 'zh-CN': '痛 / 疼', 'ko-KR': '아파요',
    'ru-RU': 'Больно', 'nl-NL': 'Pijn', 'pl-PL': 'Boli', 'tr-TR': 'Acıyor',
    'vi-VN': 'Đau', 'tl-PH': 'Masakit',
  },
  feel_angry: {
    'en-US': 'Angry', 'hu-HU': 'Mérges', 'es-ES': 'Enojado', 'ar-SA': 'غاضب',
    'fr-FR': 'Fâché', 'de-DE': 'Wütend', 'ja-JP': 'おこっている', 'pt-BR': 'Bravo',
    'it-IT': 'Arrabbiato', 'hi-IN': 'गुस्सा', 'zh-CN': '生气', 'ko-KR': '화나요',
    'ru-RU': 'Злой', 'nl-NL': 'Boos', 'pl-PL': 'Zły', 'tr-TR': 'Kızgın',
    'vi-VN': 'Tức giận', 'tl-PH': 'Galit',
  },
  feel_hungry: {
    'en-US': 'Hungry', 'hu-HU': 'Éhes', 'es-ES': 'Hambriento', 'ar-SA': 'جائع',
    'fr-FR': 'Affamé', 'de-DE': 'Hungrig', 'ja-JP': 'おなかすいた', 'pt-BR': 'Com fome',
    'it-IT': 'Affamato', 'hi-IN': 'भूख', 'zh-CN': '肚子饿', 'ko-KR': '배고파요',
    'ru-RU': 'Голоден', 'nl-NL': 'Honger', 'pl-PL': 'Głodny', 'tr-TR': 'Aç',
    'vi-VN': 'Đói bụng', 'tl-PH': 'Gutom',
  },
  feel_thirsty: {
    'en-US': 'Thirsty', 'hu-HU': 'Szomjas', 'es-ES': 'Sediento', 'ar-SA': 'عطشان',
    'fr-FR': 'Soif', 'de-DE': 'Durstig', 'ja-JP': 'のどがかわいた', 'pt-BR': 'Com sede',
    'it-IT': 'Assetato', 'hi-IN': 'प्यासा', 'zh-CN': '口渴', 'ko-KR': '목말라요',
    'ru-RU': 'Хочу пить', 'nl-NL': 'Dorst', 'pl-PL': 'Spragniony', 'tr-TR': 'Susamış',
    'vi-VN': 'Khát nước', 'tl-PH': 'Uhaw',
  },
  feel_scared: {
    'en-US': 'Scared', 'hu-HU': 'Félek', 'es-ES': 'Asustado', 'ar-SA': 'خائف',
    'fr-FR': 'Peur', 'de-DE': 'Ängstlich', 'ja-JP': 'こわい', 'pt-BR': 'Assustado',
    'it-IT': 'Spaventato', 'hi-IN': 'डरा हुआ', 'zh-CN': '害怕', 'ko-KR': '무서워요',
    'ru-RU': 'Страшно', 'nl-NL': 'Bang', 'pl-PL': 'Przestraszony', 'tr-TR': 'Korkmuş',
    'vi-VN': 'Sợ hãi', 'tl-PH': 'Natatakot',
  },

  // === PLACES ===
  place_home: {
    'en-US': 'Home', 'hu-HU': 'Otthon', 'es-ES': 'Casa', 'ar-SA': 'البيت',
    'fr-FR': 'Maison', 'de-DE': 'Zuhause', 'ja-JP': 'いえ', 'pt-BR': 'Casa',
    'it-IT': 'Casa', 'hi-IN': 'घर', 'zh-CN': '家', 'ko-KR': '집',
    'ru-RU': 'Дом', 'nl-NL': 'Thuis', 'pl-PL': 'Dom', 'tr-TR': 'Ev',
    'vi-VN': 'Nhà', 'tl-PH': 'Bahay',
  },
  place_bathroom: {
    'en-US': 'Bathroom / Toilet', 'hu-HU': 'Mosdó / WC', 'es-ES': 'Baño', 'ar-SA': 'الحمام',
    'fr-FR': 'Toilettes', 'de-DE': 'Toilette', 'ja-JP': 'トイレ', 'pt-BR': 'Banheiro',
    'it-IT': 'Bagno', 'hi-IN': 'शौचालय', 'zh-CN': '厕所 / 卫生间', 'ko-KR': '화장실',
    'ru-RU': 'Туалет', 'nl-NL': 'Wc / Toilet', 'pl-PL': 'Toaleta', 'tr-TR': 'Tuvalet',
    'vi-VN': 'Nhà vệ sinh', 'tl-PH': 'Banyo / Palikuran',
  },
  place_park: {
    'en-US': 'Park', 'hu-HU': 'Park', 'es-ES': 'Parque', 'ar-SA': 'حديقة',
    'fr-FR': 'Parc', 'de-DE': 'Park', 'ja-JP': 'こうえん', 'pt-BR': 'Parque',
    'it-IT': 'Parco', 'hi-IN': 'पार्क', 'zh-CN': '公园', 'ko-KR': '공원',
    'ru-RU': 'Парк', 'nl-NL': 'Park', 'pl-PL': 'Park', 'tr-TR': 'Park',
    'vi-VN': 'Công viên', 'tl-PH': 'Parke',
  },
  place_school: {
    'en-US': 'School', 'hu-HU': 'Iskola', 'es-ES': 'Escuela', 'ar-SA': 'مدرسة',
    'fr-FR': 'École', 'de-DE': 'Schule', 'ja-JP': 'がっこう', 'pt-BR': 'Escola',
    'it-IT': 'Scuola', 'hi-IN': 'स्कूल', 'zh-CN': '学校', 'ko-KR': '학교',
    'ru-RU': 'Школа', 'nl-NL': 'School', 'pl-PL': 'Szkoła', 'tr-TR': 'Okul',
    'vi-VN': 'Trường học', 'tl-PH': 'Paaralan',
  },
  place_car: {
    'en-US': 'Car', 'hu-HU': 'Autó', 'es-ES': 'Coche / Auto', 'ar-SA': 'سيارة',
    'fr-FR': 'Voiture', 'de-DE': 'Auto', 'ja-JP': 'くるま', 'pt-BR': 'Carro',
    'it-IT': 'Auto', 'hi-IN': 'कार', 'zh-CN': '车', 'ko-KR': '자동차',
    'ru-RU': 'Машина', 'nl-NL': 'Auto', 'pl-PL': 'Samochód', 'tr-TR': 'Araba',
    'vi-VN': 'Xe hơi', 'tl-PH': 'Kotse',
  },
  place_hospital: {
    'en-US': 'Hospital / Clinic', 'hu-HU': 'Kórház / Rendelő', 'es-ES': 'Hospital', 'ar-SA': 'مستشفى',
    'fr-FR': 'Hôpital', 'de-DE': 'Krankenhaus', 'ja-JP': 'びょういん', 'pt-BR': 'Hospital',
    'it-IT': 'Ospedale', 'hi-IN': 'अस्पताल', 'zh-CN': '医院', 'ko-KR': '병원',
    'ru-RU': 'Больница', 'nl-NL': 'Ziekenhuis', 'pl-PL': 'Szpital', 'tr-TR': 'Hastane',
    'vi-VN': 'Bệnh viện', 'tl-PH': 'Ospital',
  },

  // === TOYS & PLAY ===
  toy_ball: {
    'en-US': 'Ball', 'hu-HU': 'Labda', 'es-ES': 'Pelota', 'ar-SA': 'كرة',
    'fr-FR': 'Ballon', 'de-DE': 'Ball', 'ja-JP': 'ボール', 'pt-BR': 'Bola',
    'it-IT': 'Palla', 'hi-IN': 'गेंद', 'zh-CN': '球', 'ko-KR': '공',
    'ru-RU': 'Мяч', 'nl-NL': 'Bal', 'pl-PL': 'Piłka', 'tr-TR': 'Top',
    'vi-VN': 'Quả bóng', 'tl-PH': 'Bola',
  },
  toy_tablet: {
    'en-US': 'Tablet / iPad', 'hu-HU': 'Tablet', 'es-ES': 'Tableta', 'ar-SA': 'تابلت',
    'fr-FR': 'Tablette', 'de-DE': 'Tablet', 'ja-JP': 'タブレット', 'pt-BR': 'Tablet',
    'it-IT': 'Tablet', 'hi-IN': 'टैबलेट', 'zh-CN': '平板', 'ko-KR': '태블릿',
    'ru-RU': 'Планшет', 'nl-NL': 'Tablet', 'pl-PL': 'Tablet', 'tr-TR': 'Tablet',
    'vi-VN': 'Máy tính bảng', 'tl-PH': 'Tablet',
  },
  toy_blocks: {
    'en-US': 'Blocks / LEGO', 'hu-HU': 'Építőkockák', 'es-ES': 'Bloques', 'ar-SA': 'مكعبات',
    'fr-FR': 'Blocs', 'de-DE': 'Bauklötze', 'ja-JP': 'ブロック', 'pt-BR': 'Blocos',
    'it-IT': 'Costruzioni', 'hi-IN': 'ब्लॉक', 'zh-CN': '积木', 'ko-KR': '블록',
    'ru-RU': 'Кубики', 'nl-NL': 'Blokken', 'pl-PL': 'Klocki', 'tr-TR': 'Bloklar',
    'vi-VN': 'Khối xếp hình', 'tl-PH': 'Bloke',
  },
  toy_puzzle: {
    'en-US': 'Puzzle', 'hu-HU': 'Kirakó', 'es-ES': 'Rompecabezas', 'ar-SA': 'لغز',
    'fr-FR': 'Puzzle', 'de-DE': 'Puzzle', 'ja-JP': 'パズル', 'pt-BR': 'Quebra-cabeça',
    'it-IT': 'Puzzle', 'hi-IN': 'पहेली', 'zh-CN': '拼图', 'ko-KR': '퍼즐',
    'ru-RU': 'Пазл', 'nl-NL': 'Puzzel', 'pl-PL': 'Układanka', 'tr-TR': 'Yapboz',
    'vi-VN': 'Tranh ghép', 'tl-PH': 'Puzzle',
  },
  toy_drawing: {
    'en-US': 'Drawing / Crayons', 'hu-HU': 'Rajzolás', 'es-ES': 'Dibujar', 'ar-SA': 'رسم',
    'fr-FR': 'Dessin', 'de-DE': 'Malen', 'ja-JP': 'おえかき', 'pt-BR': 'Desenho',
    'it-IT': 'Disegnare', 'hi-IN': 'चित्रकारी', 'zh-CN': '画画', 'ko-KR': '그림 그리기',
    'ru-RU': 'Рисовать', 'nl-NL': 'Tekenen', 'pl-PL': 'Rysowanie', 'tr-TR': 'Resim çizmek',
    'vi-VN': 'Vẽ tranh', 'tl-PH': 'Pagguhit',
  },
  toy_bubbles: {
    'en-US': 'Bubbles', 'hu-HU': 'Buborékok', 'es-ES': 'Burbujas', 'ar-SA': 'فقاعات',
    'fr-FR': 'Bulles', 'de-DE': 'Seifenblasen', 'ja-JP': 'シャボン玉', 'pt-BR': 'Bolhas',
    'it-IT': 'Bolle', 'hi-IN': 'बुलबुले', 'zh-CN': '泡泡', 'ko-KR': '비눗방울',
    'ru-RU': 'Мыльные пузыри', 'nl-NL': 'Bellen', 'pl-PL': 'Bańki', 'tr-TR': 'Köpükler',
    'vi-VN': 'Bong bóng', 'tl-PH': 'Bula',
  },

  // === PEOPLE ===
  ppl_mom: {
    'en-US': 'Mom / Mother', 'hu-HU': 'Anya / Anyu', 'es-ES': 'Mamá', 'ar-SA': 'ماما',
    'fr-FR': 'Maman', 'de-DE': 'Mama', 'ja-JP': 'おかあさん', 'pt-BR': 'Mamãe',
    'it-IT': 'Mamma', 'hi-IN': 'माँ', 'zh-CN': '妈妈', 'ko-KR': '엄마',
    'ru-RU': 'Мама', 'nl-NL': 'Mama', 'pl-PL': 'Mama', 'tr-TR': 'Anne',
    'vi-VN': 'Mẹ', 'tl-PH': 'Nanay / Mama',
  },
  ppl_dad: {
    'en-US': 'Dad / Father', 'hu-HU': 'Apa / Apu', 'es-ES': 'Papá', 'ar-SA': 'بابا',
    'fr-FR': 'Papa', 'de-DE': 'Papa', 'ja-JP': 'おとうさん', 'pt-BR': 'Papai',
    'it-IT': 'Papà', 'hi-IN': 'पापा', 'zh-CN': '爸爸', 'ko-KR': '아빠',
    'ru-RU': 'Папа', 'nl-NL': 'Papa', 'pl-PL': 'Tata', 'tr-TR': 'Baba',
    'vi-VN': 'Bố', 'tl-PH': 'Tatay / Papa',
  },
  ppl_teacher: {
    'en-US': 'Teacher', 'hu-HU': 'Tanár / Tanárnő', 'es-ES': 'Profesor / Maestro', 'ar-SA': 'معلم',
    'fr-FR': 'Enseignant', 'de-DE': 'Lehrer', 'ja-JP': 'せんせい', 'pt-BR': 'Professor',
    'it-IT': 'Insegnante', 'hi-IN': 'शिक्षक', 'zh-CN': '老师', 'ko-KR': '선생님',
    'ru-RU': 'Учитель', 'nl-NL': 'Leraar', 'pl-PL': 'Nauczyciel', 'tr-TR': 'Öğretmen',
    'vi-VN': 'Thầy / Cô', 'tl-PH': 'Guro',
  },
  ppl_friend: {
    'en-US': 'Friend', 'hu-HU': 'Barát', 'es-ES': 'Amigo', 'ar-SA': 'صديق',
    'fr-FR': 'Ami', 'de-DE': 'Freund', 'ja-JP': 'ともだち', 'pt-BR': 'Amigo',
    'it-IT': 'Amico', 'hi-IN': 'दोस्त', 'zh-CN': '朋友', 'ko-KR': '친구',
    'ru-RU': 'Друг', 'nl-NL': 'Vriend', 'pl-PL': 'Przyjaciel', 'tr-TR': 'Arkadaş',
    'vi-VN': 'Bạn bè', 'tl-PH': 'Kaibigan',
  },
  ppl_you: {
    'en-US': 'You', 'hu-HU': 'Te / Neked', 'es-ES': 'Tú', 'ar-SA': 'أنت',
    'fr-FR': 'Toi', 'de-DE': 'Du / Dir', 'ja-JP': 'あなた', 'pt-BR': 'Você',
    'it-IT': 'Tu', 'hi-IN': 'आप / तुम', 'zh-CN': '你', 'ko-KR': '너 / 당신',
    'ru-RU': 'Ты', 'nl-NL': 'Jij', 'pl-PL': 'Ty', 'tr-TR': 'Sen',
    'vi-VN': 'Bạn', 'tl-PH': 'Ikaw',
  },

  // === SOCIAL & POLITE ===
  soc_hello: {
    'en-US': 'Hello / Hi', 'hu-HU': 'Szia / Helló', 'es-ES': 'Hola', 'ar-SA': 'مرحباً',
    'fr-FR': 'Bonjour', 'de-DE': 'Hallo', 'ja-JP': 'こんにちは', 'pt-BR': 'Olá',
    'it-IT': 'Ciao', 'hi-IN': 'नमस्ते', 'zh-CN': '你好', 'ko-KR': '안녕하세요',
    'ru-RU': 'Привет', 'nl-NL': 'Hallo', 'pl-PL': 'Cześć', 'tr-TR': 'Merhaba',
    'vi-VN': 'Xin chào', 'tl-PH': 'Kumusta',
  },
  soc_bye: {
    'en-US': 'Goodbye / Bye', 'hu-HU': 'Viszlát', 'es-ES': 'Adiós', 'ar-SA': 'مع السلامة',
    'fr-FR': 'Au revoir', 'de-DE': 'Tschüss', 'ja-JP': 'さようなら', 'pt-BR': 'Tchau',
    'it-IT': 'Arrivederci', 'hi-IN': 'अलविदा', 'zh-CN': '再见', 'ko-KR': '안녕히 가세요',
    'ru-RU': 'Пока', 'nl-NL': 'Doei', 'pl-PL': 'Do widzenia', 'tr-TR': 'Hoşça kal',
    'vi-VN': 'Tạm biệt', 'tl-PH': 'Paalam',
  },
  soc_sorry: {
    'en-US': 'Sorry', 'hu-HU': 'Bocsánat', 'es-ES': 'Lo siento', 'ar-SA': 'آسف',
    'fr-FR': 'Pardon', 'de-DE': 'Entschuldigung', 'ja-JP': 'ごめんなさい', 'pt-BR': 'Desculpe',
    'it-IT': 'Scusa', 'hi-IN': 'माफ़ कीजिये', 'zh-CN': '对不起', 'ko-KR': '죄송합니다',
    'ru-RU': 'Извините', 'nl-NL': 'Sorry', 'pl-PL': 'Przepraszam', 'tr-TR': 'Özür dilerim',
    'vi-VN': 'Xin lỗi', 'tl-PH': 'Patawad',
  },
  soc_love: {
    'en-US': 'I Love You', 'hu-HU': 'Szeretlek', 'es-ES': 'Te quiero', 'ar-SA': 'أحبك',
    'fr-FR': 'Je t’aime', 'de-DE': 'Ich liebe dich', 'ja-JP': 'だいすき', 'pt-BR': 'Eu te amo',
    'it-IT': 'Ti voglio bene', 'hi-IN': 'मैं तुमसे प्यार करता हूँ', 'zh-CN': '我爱你', 'ko-KR': '사랑해요',
    'ru-RU': 'Я люблю тебя', 'nl-NL': 'Ik hou van jou', 'pl-PL': 'Kocham cię', 'tr-TR': 'Seni seviyorum',
    'vi-VN': 'Tôi yêu bạn', 'tl-PH': 'Mahal kita',
  },

  // === EMERGENCY ===
  emg_help_now: {
    'en-US': 'Need Help Now!', 'hu-HU': 'AZONNAL SEGÍTS!', 'es-ES': '¡Necesito ayuda ya!', 'ar-SA': 'أحتاج مساعدة الآن!',
    'fr-FR': 'Aide immédiate !', 'de-DE': 'Brauche sofort Hilfe!', 'ja-JP': 'いますぐ助けて！', 'pt-BR': 'Preciso de ajuda agora!',
    'it-IT': 'Aiuto urgente!', 'hi-IN': 'तुरंत मदद चाहिए!', 'zh-CN': '现在需要帮助！', 'ko-KR': '지금 도와주세요!',
    'ru-RU': 'Срочно помогите!', 'nl-NL': 'Nu hulp nodig!', 'pl-PL': 'Pomocy natychmiast!', 'tr-TR': 'Hemen yardım lazım!',
    'vi-VN': 'Cần giúp ngay!', 'tl-PH': 'Kailangan ng tulong ngayon!',
  },
  emg_hurt_bad: {
    'en-US': 'Hurts Very Bad', 'hu-HU': 'Nagyon fáj!', 'es-ES': 'Me duele mucho', 'ar-SA': 'يؤلمني بشدة',
    'fr-FR': 'Ça fait très mal', 'de-DE': 'Tut sehr weh', 'ja-JP': 'すごく痛い', 'pt-BR': 'Dói muito',
    'it-IT': 'Fa molto male', 'hi-IN': 'बहुत दर्द हो रहा है', 'zh-CN': '疼得很厉害', 'ko-KR': '너무 아파요',
    'ru-RU': 'Очень больно', 'nl-NL': 'Doet veel pijn', 'pl-PL': 'Bardzo boli', 'tr-TR': 'Çok acıyor',
    'vi-VN': 'Đau rất nhiều', 'tl-PH': 'Sobrang sakit',
  },
  emg_lost: {
    'en-US': 'I Am Lost', 'hu-HU': 'Eltévedtem', 'es-ES': 'Estoy perdido', 'ar-SA': 'أنا تائه',
    'fr-FR': 'Je suis perdu', 'de-DE': 'Ich habe mich verirrt', 'ja-JP': 'まよ子です', 'pt-BR': 'Estou perdido',
    'it-IT': 'Mi sono perso', 'hi-IN': 'मैं खो गया हूँ', 'zh-CN': '我迷路了', 'ko-KR': '길을 잃었어요',
    'ru-RU': 'Я потерялся', 'nl-NL': 'Ik ben verdwaald', 'pl-PL': 'Zgubiłem się', 'tr-TR': 'Kayboldum',
    'vi-VN': 'Tôi bị lạc', 'tl-PH': 'Naliligaw ako',
  },
  emg_sick: {
    'en-US': 'I Feel Sick', 'hu-HU': 'Rosszul vagyok', 'es-ES': 'Me siento mal', 'ar-SA': 'أشعر بالمرض',
    'fr-FR': 'Je me sens mal', 'de-DE': 'Mir ist schlecht', 'ja-JP': 'きもちわるい', 'pt-BR': 'Estou passando mal',
    'it-IT': 'Non mi sento bene', 'hi-IN': 'तबीयत खराब है', 'zh-CN': '我不舒服', 'ko-KR': '속이 안 좋아요',
    'ru-RU': 'Мне плохо', 'nl-NL': 'Ik voel me ziek', 'pl-PL': 'Źle się czuję', 'tr-TR': 'Hastayım',
    'vi-VN': 'Tôi thấy khó chịu', 'tl-PH': 'Masama ang pakiramdam ko',
  },
};

// Also populate hyphenated ID aliases so looking up by tile.id directly (e.g. 'core-want') works 100% identically
for (const key of Object.keys(TILE_TRANSLATIONS)) {
  const hyphenated = key.replace(/_/g, '-');
  if (!TILE_TRANSLATIONS[hyphenated]) {
    TILE_TRANSLATIONS[hyphenated] = TILE_TRANSLATIONS[key];
  }
}

/**
 * Returns the localized visual display label for any AACTile.
 * Order of precedence:
 * 1. Semantic Key lookup in centralized TILE_TRANSLATIONS
 * 2. Tile ID lookup in centralized TILE_TRANSLATIONS
 * 3. Tile's own translations map for langCode
 * 4. Tile's own 'en-US' translation or base label
 */
export function getTileDisplayLabel(tile: AACTile, langCode: string): string {
  if (!tile) return '';

  // 1. Semantic key lookup
  if (tile.semanticKey && TILE_TRANSLATIONS[tile.semanticKey]?.[langCode]) {
    return TILE_TRANSLATIONS[tile.semanticKey][langCode];
  }

  // 2. Tile ID lookup (e.g. 'core-want' or 'core_want')
  if (TILE_TRANSLATIONS[tile.id]?.[langCode]) {
    return TILE_TRANSLATIONS[tile.id][langCode];
  }

  const normalizedId = tile.id.replace(/-/g, '_');
  if (TILE_TRANSLATIONS[normalizedId]?.[langCode]) {
    return TILE_TRANSLATIONS[normalizedId][langCode];
  }

  // 3. Tile's custom translations object
  if (tile.translations?.[langCode]) {
    return tile.translations[langCode];
  }

  // 4. Default / English fallback
  if (tile.translations?.['en-US']) {
    return tile.translations['en-US'];
  }

  return tile.label;
}

/**
 * Returns the localized spoken word for SpeechSynthesis.
 * When spoken in non-English languages, returns the localized label in that language.
 * When spoken in English, respects any specialized tile.spokenText, else returns display label.
 */
export function getTileSpokenText(tile: AACTile, langCode: string): string {
  if (!tile) return '';

  // If in English and explicit spokenText is customized
  if (langCode === 'en-US' && tile.spokenText) {
    return tile.spokenText;
  }

  // In all other target languages, speak the localized display label
  return getTileDisplayLabel(tile, langCode);
}
