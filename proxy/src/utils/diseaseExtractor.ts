/**
 * Disease Name Extractor - Extracts disease names from natural language questions
 */

// Common question patterns in multiple languages
const QUESTION_PATTERNS = [
  // English - symptoms/causes/treatment patterns (more specific, should be first)
  /(?:what (?:are|is)|what're|tell me)?\s*(?:the\s+)?(?:symptoms?|causes?|treatments?)(?:\s+of|\s+for)\s+(.+?)(?:\?|$)/i,
  /(?:explain|describe)?\s*(?:the\s+)?(?:symptoms?|causes?|treatments?)(?:\s+of|\s+for)\s+(.+?)(?:\?|$)/i,

  // English - general patterns
  /(?:what is|tell me about|explain|describe|information about|info on)\s+(.+?)(?:\?|$)/i,
  /(?:do you know about|have you heard of)\s+(.+?)(?:\?|$)/i,

  // Portuguese - symptoms/causes/treatment patterns (with accent variations)
  /(?:quais\s+)?(?:s(?:ã|a)o|sao)?\s*(?:os?|as?)\s+(?:sintomas?|causas?|tratamentos?)(?:\s+d[aeo])\s+(?:a |o |as |os )?(.+?)(?:\?|$)/i,

  // Portuguese - general patterns (with accent variations)
  /(?:o que (?:é|e)|explica(?:-me)?|fala(?:-me)? (?:de|sobre)|informa(?:ção|cao) sobre)\s+(?:a |o |as |os )?(.+?)(?:\?|$)/i,
  /(?:conheces|sabes algo sobre)\s+(?:a |o |as |os )?(.+?)(?:\?|$)/i,

  // Spanish - symptoms/causes/treatment patterns
  /(?:cuáles\s+son|cu[aá]les)?\s*(?:los?|las?)\s+(?:síntomas?|causas?|tratamientos?)(?:\s+de)\s+(?:la |el |las |los )?(.+?)(?:\?|$)/i,

  // Spanish - general patterns
  /(?:qué es|cuéntame sobre|explica|información sobre)\s+(?:la |el |las |los )?(.+?)(?:\?|$)/i,

  // French - symptoms/causes/treatment patterns
  /(?:quels\s+sont)?\s*(?:les?)\s+(?:symptômes?|causes?|traitements?)(?:\s+de)\s+(?:la |le |les |l')?(.+?)(?:\?|$)/i,

  // French - general patterns
  /(?:qu'est-ce que|parle(?:-moi)? de|explique|information sur)\s+(?:la |le |les |l')?(.+?)(?:\?|$)/i,
];

// Common stop words to remove
const STOP_WORDS = new Set([
  // English
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
  'what', 'which', 'who', 'when', 'where', 'why', 'how', 'about', 'with',
  'symptoms', 'symptom', 'causes', 'cause', 'treatment', 'cure',

  // Portuguese
  'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'da', 'do',
  'das', 'dos', 'em', 'no', 'na', 'nos', 'nas', 'por', 'para', 'que',
  'qual', 'quais', 'quando', 'onde', 'como', 'porque', 'com', 'sem',
  'sintomas', 'sintoma', 'causas', 'causa', 'tratamento', 'cura',
  'são', 'é', 'sao', 'e',

  // Spanish
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'del', 'al',
  'qué', 'cual', 'cuales', 'cuando', 'donde', 'como', 'porque', 'con',
  'síntomas', 'síntoma', 'causas', 'causa', 'tratamiento',

  // French
  'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'à', 'avec',
  'quoi', 'quel', 'quand', 'où', 'comment', 'pourquoi',
  'symptômes', 'symptôme', 'causes', 'cause', 'traitement',
]);

/**
 * Extract potential disease name from a natural language question
 */
export function extractDiseaseName(query: string): string | null {
  if (!query || typeof query !== 'string') {
    return null;
  }

  const normalizedQuery = query.trim();

  // Strategy 1: Try pattern matching first (most reliable)
  for (const pattern of QUESTION_PATTERNS) {
    const match = normalizedQuery.match(pattern);
    if (match && match[1]) {
      let extracted = match[1].trim();
      extracted = cleanExtractedTerm(extracted);

      if (extracted.length >= 3) {
        return extracted;
      }
    }
  }

  // Strategy 2: Look for medical terms with specific patterns
  // Match compound disease names (e.g., "Ehlers-Danlos syndrome", "type 1 diabetes")
  const medicalPatterns = [
    // Syndrome names: "X syndrome", "syndrome de X"
    /(?:syndrome(?:\s+de)?|s(?:í|i)ndrome(?:\s+de)?)\s+([a-zA-ZÀ-ÿ\-]+(?:\s+[a-zA-ZÀ-ÿ\-]+)*)/gi,
    /([a-zA-ZÀ-ÿ\-]+(?:\s+[a-zA-ZÀ-ÿ\-]+)*)\s+(?:syndrome|s(?:í|i)ndrome)/gi,

    // Disease names: "X disease", "doença de X"
    /(?:disease|doença|enfermedad|maladie)(?:\s+de(?:\s+la)?|\s+of)?\s+([a-zA-ZÀ-ÿ\-]+(?:\s+[a-zA-ZÀ-ÿ\-]+)*)/gi,
    /([a-zA-ZÀ-ÿ\-]+(?:\s+[a-zA-ZÀ-ÿ\-]+)*)\s+(?:disease|doença|enfermedad|maladie)/gi,

    // Disorder names
    /([a-zA-ZÀ-ÿ\-]+(?:\s+[a-zA-ZÀ-ÿ\-]+)*)\s+(?:disorder|transtorno|trastorno|trouble)/gi,

    // Names with hyphens (often diseases like Ehlers-Danlos, Crohn's)
    /\b([A-Z][a-zA-ZÀ-ÿ]*\-[A-Z][a-zA-ZÀ-ÿ]*(?:\s+[a-zA-ZÀ-ÿ]+)?)\b/g,

    // Type X patterns: "hemophilia A", "diabetes type 2"
    /\b([a-zA-ZÀ-ÿ]+)\s+(?:type|tipo|grade)\s+[A-Z0-9]+/gi,
  ];

  for (const pattern of medicalPatterns) {
    const matches = normalizedQuery.matchAll(pattern);
    for (const match of matches) {
      let extracted = (match[1] || match[0]).trim();
      extracted = cleanExtractedTerm(extracted);

      // Filter out very short or very long extractions
      const wordCount = extracted.split(/\s+/).length;
      if (extracted.length >= 3 && wordCount >= 1 && wordCount <= 6) {
        return extracted;
      }
    }
  }

  // Strategy 3: Look for capitalized medical terms (proper nouns)
  const capitalizedPattern = /\b([A-Z][a-zA-ZÀ-ÿ]+(?:['']?s)?(?:\s+[A-Z]?[a-zA-ZÀ-ÿ\-]+)*)\b/g;
  const capitalizedMatches = normalizedQuery.matchAll(capitalizedPattern);

  for (const match of capitalizedMatches) {
    let extracted = match[1].trim();

    // Skip common question words
    if (/^(What|Tell|Explain|Who|Where|When|Why|How|O|A|The|La|Le|El)$/i.test(extracted)) {
      continue;
    }

    extracted = cleanExtractedTerm(extracted);
    const wordCount = extracted.split(/\s+/).length;

    // Only return if it looks like a medical term (2-4 words, proper case)
    if (extracted.length >= 4 && wordCount >= 1 && wordCount <= 4) {
      return extracted;
    }
  }

  // Strategy 4: Only use as last resort - check if it's a very short, simple term
  // This prevents extracting full sentences as disease names
  const cleaned = cleanExtractedTerm(normalizedQuery);
  const wordCount = cleaned.split(/\s+/).length;

  // Only accept 1-2 word queries that don't contain common verbs/questions
  const hasVerbs = /\b(faz|me|uma|qual|como|what|how|tell|make|do|does|is|are|have)\b/i.test(cleaned);

  if (!hasVerbs && cleaned.length >= 3 && wordCount >= 1 && wordCount <= 2) {
    return cleaned;
  }

  return null;
}

/**
 * Clean extracted term by removing stop words and punctuation
 */
function cleanExtractedTerm(term: string): string {
  // Remove question marks and extra punctuation
  let cleaned = term.replace(/[?!.,;:]+$/g, '').trim();

  // Remove common medical keywords that appear in multiple languages
  // This helps normalize searches across languages (e.g., "sindrome de X" -> "X")
  const medicalKeywords = /\b(syndrome|s(?:í|i)ndrome|disease|doença|enfermedad|maladie|disorder|transtorno|trastorno|trouble)(?:\s+de(?:\s+la)?|\s+of|\s+d[aeo])?\b/gi;
  cleaned = cleaned.replace(medicalKeywords, '').trim();

  // Split into words
  const words = cleaned.split(/\s+/);

  // Remove leading/trailing stop words but keep medical terms
  const filtered = words.filter((word, index) => {
    const lowerWord = word.toLowerCase();

    // Always keep words in the middle
    if (index > 0 && index < words.length - 1) {
      return true;
    }

    // Remove stop words at edges
    return !STOP_WORDS.has(lowerWord);
  });

  return filtered.join(' ').trim();
}

/**
 * Extract multiple potential disease names from text
 */
export function extractMultipleDiseaseNames(query: string): string[] {
  const names: string[] = [];

  const primary = extractDiseaseName(query);
  if (primary) {
    names.push(primary);
  }

  // Also try splitting by common conjunctions
  const parts = query.split(/\s+(?:and|or|e|ou|y|et)\s+/i);
  for (const part of parts) {
    const extracted = extractDiseaseName(part);
    if (extracted && !names.includes(extracted)) {
      names.push(extracted);
    }
  }

  return names;
}
