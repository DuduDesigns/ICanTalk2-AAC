// NLP Grammar and Sentence Expansion Service

export interface GrammarExpansionResult {
  expandedText: string;
  source: 'gemini-ai' | 'rule-fallback';
}

class GrammarService {
  /**
   * Expands an array of raw AAC token strings into a natural, grammatically correct full sentence.
   */
  public async expandTokens(
    tokens: string[],
    languageName: string,
    languageCode: string,
    tone: 'natural' | 'polite' = 'natural'
  ): Promise<GrammarExpansionResult> {
    if (!tokens || tokens.length === 0) {
      return { expandedText: '', source: 'rule-fallback' };
    }

    // For single-word taps (e.g. just "HELP" or "WATER"), speak the single word immediately
    if (tokens.length === 1) {
      const single = tokens[0].trim();
      const formatted = single.charAt(0).toUpperCase() + single.slice(1);
      return {
        expandedText: formatted,
        source: 'rule-fallback',
      };
    }

    // Attempt Gemini AI Server expansion with strict 1500ms timeout for instant fast fallback
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const response = await fetch('/api/expand-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          tokens,
          language: languageName,
          languageCode,
          tone,
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.expandedText && typeof data.expandedText === 'string') {
          return {
            expandedText: data.expandedText.trim().replace(/^["']|["']$/g, ''),
            source: data.source === 'gemini-ai' ? 'gemini-ai' : 'rule-fallback',
          };
        }
      }
    } catch {
      // Server is offline, unreachable, or timed out - immediately use offline rule engine
    }

    // Offline fast rule-based grammar transformation
    const offlineExpanded = this.offlineRuleExpand(tokens, languageCode, tone);
    return {
      expandedText: offlineExpanded,
      source: 'rule-fallback',
    };
  }

  /**
   * Offline rule-based natural grammar expansion engine
   */
  public offlineRuleExpand(tokens: string[], langCode: string, tone: 'natural' | 'polite' = 'natural'): string {
    const raw = tokens.join(' ').trim();
    if (!raw) return '';

    if (tokens.length === 1) {
      return tokens[0].charAt(0).toUpperCase() + tokens[0].slice(1);
    }

    const lowerTokens = tokens.map((t) => t.toLowerCase().trim());
    const lang = (langCode || 'en').toLowerCase();

    // English Rules
    if (lang.startsWith('en')) {
      if (lowerTokens[0] === 'i' && (lowerTokens[1] === 'want' || lowerTokens[1] === 'need')) {
        const item = tokens.slice(2).join(' ');
        const itemLower = item.toLowerCase();
        const nonCountOrPlural =
          itemLower.endsWith('s') ||
          ['water', 'milk', 'juice', 'food', 'help', 'more', 'sleep', 'rest', 'play', 'bath', 'medicine'].includes(itemLower);
        const article = /^[aeiou]/i.test(item.trim()) ? 'an' : 'a';
        const nounPhrase = nonCountOrPlural ? item : `${article} ${item}`;
        return tone === 'polite'
          ? `I would like ${nounPhrase}, please.`
          : `I want ${nounPhrase}.`;
      }
      if (lowerTokens.includes('help') && (lowerTokens.includes('i') || lowerTokens.length <= 3)) {
        return tone === 'polite' ? 'Could you please help me?' : 'Please help me.';
      }
      if (lowerTokens[0] === 'go' || (lowerTokens[0] === 'i' && lowerTokens[1] === 'go')) {
        const dest = lowerTokens[0] === 'go' ? tokens.slice(1).join(' ') : tokens.slice(2).join(' ');
        return `I want to go to the ${dest}.`;
      }
      if (lowerTokens[0] === 'i' && lowerTokens[1] === 'feel') {
        return `I feel ${tokens.slice(2).join(' ')}.`;
      }
      if (lowerTokens[0] === 'i' && lowerTokens[1] === 'like') {
        return `I really like ${tokens.slice(2).join(' ')}.`;
      }
      if (lowerTokens[0] === 'i' && lowerTokens[1] === 'see') {
        return `I see ${tokens.slice(2).join(' ')}.`;
      }
    }

    // Hungarian Rules (hu)
    if (lang.startsWith('hu')) {
      if (lowerTokens[0] === 'én' && (lowerTokens[1]?.includes('kér') || lowerTokens[1]?.includes('akar'))) {
        return `Szeretnék kérni ${tokens.slice(2).join(' ')}, légy szíves.`;
      }
      if (lowerTokens.includes('segíts') || lowerTokens.includes('segítség')) {
        return 'Kérlek, segíts nekem!';
      }
      if (lowerTokens.includes('fáj')) {
        return 'Nagyon fáj, kérlek segíts!';
      }
      if (lowerTokens[0] === 'én' && lowerTokens[1]?.includes('szeret')) {
        return `Nagyon szeretem a(z) ${tokens.slice(2).join(' ')}.`;
      }
    }

    // Spanish Rules (es)
    if (lang.startsWith('es')) {
      if (lowerTokens[0] === 'yo' && (lowerTokens[1] === 'quiero' || lowerTokens[1] === 'necesito')) {
        return `Yo quisiera ${tokens.slice(2).join(' ')}, por favor.`;
      }
      if (lowerTokens.includes('ayuda') || lowerTokens.includes('ayúdame')) {
        return '¡Por favor, ayúdame!';
      }
      if (lowerTokens[0] === 'yo' && lowerTokens[1] === 'siento') {
        return `Me siento ${tokens.slice(2).join(' ')}.`;
      }
    }

    // German Rules (de)
    if (lang.startsWith('de')) {
      if (lowerTokens[0] === 'ich' && (lowerTokens[1] === 'möchte' || lowerTokens[1] === 'will')) {
        return `Ich möchte bitte ${tokens.slice(2).join(' ')}.`;
      }
      if (lowerTokens.includes('hilfe')) {
        return 'Bitte hilf mir!';
      }
    }

    // French Rules (fr)
    if (lang.startsWith('fr')) {
      if (lowerTokens[0] === 'je' && lowerTokens[1] === 'veux') {
        return `Je voudrais ${tokens.slice(2).join(' ')}, s'il vous plaît.`;
      }
      if (lowerTokens.includes('aide')) {
        return "S'il vous plaît, aidez-moi!";
      }
    }

    // Default formatting: Capitalize first letter, ensure trailing period
    const formatted = raw.charAt(0).toUpperCase() + raw.slice(1);
    if (!/[.!?]$/.test(formatted)) {
      return formatted + '.';
    }
    return formatted;
  }
}

export const grammarService = new GrammarService();
