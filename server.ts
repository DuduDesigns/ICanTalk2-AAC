import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper to execute Gemini with automatic fallback on high-demand (503) or rate-limit (429) errors
async function generateWithFallback(
  generateFn: (modelName: string) => Promise<string>,
  models = ["gemini-3.7-flash", "gemini-3.1-flash-lite"]
): Promise<string> {
  let lastError: unknown;
  for (const model of models) {
    try {
      return await generateFn(model);
    } catch (err: any) {
      lastError = err;
      const isHighDemandOrTransient =
        err?.status === "UNAVAILABLE" ||
        err?.status === 503 ||
        err?.code === 503 ||
        err?.status === 429 ||
        err?.code === 429 ||
        err?.message?.includes("high demand") ||
        err?.message?.includes("503") ||
        err?.message?.includes("resource exhausted");

      if (isHighDemandOrTransient) {
        console.warn(`Model ${model} unavailable due to temporary demand. Trying next fallback model...`);
        // Brief pause before trying fallback model
        await new Promise((r) => setTimeout(r, 400));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Multilingual rule-based grammar expansion fallback
function expandGrammarLocally(tokens: string[], languageCode = "en", tone = "natural"): string {
  const raw = tokens.join(" ").trim();
  if (!raw) return "";

  const lower = tokens.map((t) => t.toLowerCase().trim());
  const lang = (languageCode || "en").toLowerCase();

  // English Patterns
  if (lang.startsWith("en")) {
    if (lower[0] === "i" && (lower[1] === "want" || lower[1] === "need")) {
      const item = tokens.slice(2).join(" ");
      const article = /^[aeiou]/i.test(item.trim()) ? "an" : "a";
      const isPluralOrNonCount = item.endsWith("s") || ["water", "milk", "juice", "food", "help", "more", "sleep"].includes(item.toLowerCase());
      const nounPhrase = isPluralOrNonCount ? item : `${article} ${item}`;
      return tone === "polite"
        ? `I would like ${nounPhrase}, please.`
        : `I want ${nounPhrase}.`;
    }
    if (lower.includes("help")) {
      return tone === "polite" ? "Could you please help me?" : "Please help me.";
    }
    if (lower[0] === "i" && lower[1] === "like") {
      return `I like ${tokens.slice(2).join(" ")}.`;
    }
    if (lower[0] === "i" && lower[1] === "feel") {
      return `I am feeling ${tokens.slice(2).join(" ")}.`;
    }
    if (lower[0] === "go" || (lower[0] === "i" && lower[1] === "go")) {
      const destination = lower[0] === "go" ? tokens.slice(1).join(" ") : tokens.slice(2).join(" ");
      return `I want to go to ${destination}.`;
    }
  }

  // Hungarian Patterns (hu)
  if (lang.startsWith("hu")) {
    if (lower[0] === "én" && (lower[1]?.includes("kér") || lower[1]?.includes("akar"))) {
      return `Szeretnék kérni ${tokens.slice(2).join(" ")}, légy szíves.`;
    }
    if (lower.includes("segíts") || lower.includes("segítség")) {
      return "Kérlek, segíts nekem!";
    }
    if (lower.includes("fáj")) {
      return "Nagyon fáj, kérlek segíts!";
    }
  }

  // Spanish Patterns (es)
  if (lang.startsWith("es")) {
    if (lower[0] === "yo" && lower[1] === "quiero") {
      return `Yo quiero ${tokens.slice(2).join(" ")}, por favor.`;
    }
    if (lower.includes("ayuda")) {
      return "¡Por favor, ayúdame!";
    }
  }

  // General capitalizer & punctuation
  let sentence = raw.charAt(0).toUpperCase() + raw.slice(1);
  if (!/[.!?]$/.test(sentence)) {
    sentence += ".";
  }
  return sentence;
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "ICanTalk2 AAC Backend" });
});

// NLP Sentence Expansion & Grammar Fix
app.post("/api/expand-sentence", async (req, res) => {
  const { tokens, language = "English", languageCode = "en-US", tone = "natural" } = req.body || {};

  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    return res.status(400).json({ error: "Tokens array is required" });
  }

  const rawSentence = tokens.join(" ");

  // Check if API key is provided
  if (!process.env.GEMINI_API_KEY) {
    const fallback = expandGrammarLocally(tokens, languageCode, tone);
    return res.json({
      expandedText: fallback || rawSentence,
      rawText: rawSentence,
      source: "rule-fallback",
    });
  }

  try {
    const prompt = `You are an AAC (Augmentative and Alternative Communication) grammar expansion engine.
The communicator tapped the following AAC tiles: "${rawSentence}".
Target Language: ${language} (Code: ${languageCode}).
Grammar Style: ${tone === "polite" ? "Polite and courteous" : "Natural, grammatically complete, first-person expressive communication"}.

Rules:
1. Convert the sequence of AAC concepts into a clear, natural, grammatically correct full sentence in ${language}.
2. Add necessary articles (a, an, the), proper verb conjugations/tenses, prepositions, and appropriate punctuation.
3. Preserve the speaker's original intent exactly (do not invent unrelated information).
4. Output ONLY the resulting sentence string, without any commentary, quotes, explanations, or formatting.`;

    const expandedText = await generateWithFallback(async (modelName) => {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          temperature: 0.3,
          maxOutputTokens: 60,
        },
      });
      return response.text ? response.text.trim().replace(/^["']|["']$/g, "") : "";
    });

    return res.json({
      expandedText: expandedText || expandGrammarLocally(tokens, languageCode, tone),
      rawText: rawSentence,
      source: "gemini-ai",
    });
  } catch (err: unknown) {
    console.warn("Gemini expansion handled with local rule engine:", (err as any)?.message || err);
    // Graceful fallback to rich local rule engine when Gemini is under high demand (503) or offline
    const fallback = expandGrammarLocally(tokens, languageCode, tone);
    return res.json({
      expandedText: fallback || rawSentence,
      rawText: rawSentence,
      source: "rule-fallback",
    });
  }
});

// AI Smart Tile Suggestion & Quick Phrases Generator
app.post("/api/suggest-phrases", async (req, res) => {
  const { category = "core", currentTiles = [], language = "English" } = req.body || {};

  const defaultCategoryPhrases: Record<string, string[]> = {
    food: ["I am hungry", "I want a drink of water", "Can I have a snack please?", "I am finished eating"],
    actions: ["I want to play", "Let's go outside", "I need to rest", "Help me with this please"],
    feelings: ["I feel very happy today", "I feel tired and need a break", "I am feeling frustrated", "I love this so much"],
    places: ["I want to go home", "Can we go to the park?", "I want to visit school", "Let's go to the store"],
    social: ["Hello, how are you?", "Thank you very much!", "Excuse me please", "Goodbye, see you later"],
    toys: ["I want to play with blocks", "Can I have the tablet?", "Let's draw together", "It is my turn to play"],
    core: ["I want more please", "Stop please", "I like this", "Please help me"],
  };

  const localFallbacks = defaultCategoryPhrases[category] || [
    `I want ${category}`,
    `Please help me with ${category}`,
    `I really like this`,
    `No thank you`,
  ];

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ suggestions: localFallbacks });
  }

  try {
    const prompt = `Generate 4 practical, high-frequency AAC phrases related to the category "${category}" in language "${language}".
Context tiles: ${currentTiles.join(", ")}.
Return ONLY a JSON array of 4 short strings (e.g. ["Phrase 1", "Phrase 2", "Phrase 3", "Phrase 4"]).`;

    const rawJson = await generateWithFallback(async (modelName) => {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });
      return response.text?.trim() || "[]";
    });

    let suggestions: string[] = [];
    try {
      suggestions = JSON.parse(rawJson);
    } catch {
      suggestions = localFallbacks;
    }

    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      suggestions = localFallbacks;
    }

    return res.json({ suggestions });
  } catch (err) {
    console.warn("Suggestion handled with local phrases fallback:", (err as any)?.message || err);
    return res.json({ suggestions: localFallbacks });
  }
});

// Vite Middleware Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ICanTalk2 AAC server running on http://localhost:${PORT}`);
  });
}

startServer();
