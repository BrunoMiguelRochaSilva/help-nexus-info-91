import { env } from '../config/env.js';
import logger from '../utils/logger.js';
import type { OrphaDisease } from '../types/index.js';

interface OrphaEntry {
  ORPHAcode: number;
  preferredTerm: string;
}

export class OrphadataService {
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheDuration: number = 1000 * 60 * 60; // 1 hour
  private diseaseIndex: OrphaEntry[] = [];
  private indexLoaded: boolean = false;
  private indexLoadPromise: Promise<void> | null = null;

  constructor() {
    this.baseUrl = env.ORPHADATA_API_URL;
    this.cache = new Map();
    // Start loading the index in the background
    this.loadDiseaseIndex();
  }

  /**
   * Load the complete disease index from Orphadata
   */
  private async loadDiseaseIndex(): Promise<void> {
    // Prevent multiple simultaneous loads
    if (this.indexLoadPromise) {
      return this.indexLoadPromise;
    }

    this.indexLoadPromise = (async () => {
      try {
        logger.info('Loading Orphadata disease index...');

        const response = await fetch(`${this.baseUrl}/rd-classification/orphacodes`);

        if (!response.ok) {
          throw new Error(`Failed to load disease index: ${response.status}`);
        }

        const data = await response.json();

        // Extract the results array
        if (data?.data?.results && Array.isArray(data.data.results)) {
          this.diseaseIndex = data.data.results;
          this.indexLoaded = true;
          logger.info(`Loaded ${this.diseaseIndex.length} diseases into search index`);
        } else {
          throw new Error('Invalid response structure from Orphadata');
        }
      } catch (error) {
        logger.error('Failed to load Orphadata disease index:', error);
        this.indexLoaded = false;
      }
    })();

    return this.indexLoadPromise;
  }

  /**
   * Fuzzy search for diseases by name
   * Uses simple string matching with case-insensitive partial matches
   */
  private fuzzySearch(query: string, maxResults: number = 5): OrphaEntry[] {
    if (!this.indexLoaded || this.diseaseIndex.length === 0) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results: Array<{ entry: OrphaEntry; score: number }> = [];

    for (const entry of this.diseaseIndex) {
      // Skip entries with missing or invalid preferredTerm
      if (!entry.preferredTerm || typeof entry.preferredTerm !== 'string') {
        continue;
      }

      const normalizedTerm = entry.preferredTerm.toLowerCase();

      // Exact match (highest priority)
      if (normalizedTerm === normalizedQuery) {
        results.push({ entry, score: 1000 });
        continue;
      }

      // Starts with query (high priority)
      if (normalizedTerm.startsWith(normalizedQuery)) {
        results.push({ entry, score: 500 });
        continue;
      }

      // Contains query as whole word (medium priority)
      const wordBoundaryRegex = new RegExp(`\\b${normalizedQuery}\\b`, 'i');
      if (wordBoundaryRegex.test(normalizedTerm)) {
        results.push({ entry, score: 300 });
        continue;
      }

      // Contains query anywhere (low priority)
      if (normalizedTerm.includes(normalizedQuery)) {
        results.push({ entry, score: 100 });
        continue;
      }

      // Levenshtein-like partial match for single word queries
      if (!normalizedQuery.includes(' ') && normalizedQuery.length >= 4) {
        const words = normalizedTerm.split(/\s+/);
        for (const word of words) {
          if (this.isSimilar(word, normalizedQuery)) {
            results.push({ entry, score: 50 });
            break;
          }
        }
      }
    }

    // Sort by score (descending) and return top results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(r => r.entry);
  }

  /**
   * Simple similarity check for fuzzy matching
   */
  private isSimilar(str1: string, str2: string): boolean {
    const maxDistance = Math.floor(Math.min(str1.length, str2.length) * 0.3);
    return this.levenshteinDistance(str1, str2) <= maxDistance;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,    // deletion
            dp[i][j - 1] + 1,    // insertion
            dp[i - 1][j - 1] + 1 // substitution
          );
        }
      }
    }

    return dp[m][n];
  }

  private getCached(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async searchDisease(term: string, lang: string = 'en'): Promise<OrphaDisease | null> {
    try {
      const cacheKey = `search:${term}:${lang}`;
      const cached = this.getCached(cacheKey);
      if (cached) return cached;

      // Ensure the index is loaded
      if (!this.indexLoaded) {
        logger.info('Waiting for disease index to load...');
        await this.loadDiseaseIndex();
      }

      if (!this.indexLoaded) {
        logger.warn('Disease index not available, cannot perform search');
        return null;
      }

      logger.info(`Searching Orphadata for: ${term} (lang: ${lang})`);

      // Use fuzzy search to find matching diseases
      const matches = this.fuzzySearch(term, 1);

      if (matches.length === 0) {
        logger.info(`No matches found for: ${term}`);
        return null;
      }

      const bestMatch = matches[0];
      logger.info(`Found match: ${bestMatch.preferredTerm} (ORPHA:${bestMatch.ORPHAcode})`);

      // Get full disease details
      const diseaseDetails = await this.getDiseaseDetails(bestMatch.ORPHAcode.toString(), lang);

      this.setCache(cacheKey, diseaseDetails);
      return diseaseDetails;
    } catch (error) {
      logger.error('Orphadata search failed:', error);
      return null;
    }
  }

  async getDiseaseDetails(orphacode: string, lang: string = 'en'): Promise<OrphaDisease | null> {
    try {
      const cacheKey = `details:${orphacode}:${lang}`;
      const cached = this.getCached(cacheKey);
      if (cached) return cached;

      logger.info(`Fetching disease details for Orphacode: ${orphacode}`);

      const response = await fetch(
        `${this.baseUrl}/rd-cross-referencing/orphacodes/${orphacode}?lang=${lang}`
      );

      if (!response.ok) {
        logger.warn(`Failed to fetch details for Orphacode: ${orphacode}`);
        return null;
      }

      const data = await response.json();

      // Extract results from response structure
      const results = data?.data?.results;
      if (!results) {
        logger.warn(`No results in response for Orphacode: ${orphacode}`);
        return null;
      }

      // Parse the response structure
      const disease: OrphaDisease = {
        orphacode: orphacode,
        name: results['Preferred term'] || results.Name || results.PreferredTerm || 'Unknown',
        synonyms: results.SynonymList?.map((s: any) => s.Synonym).filter((s: any) => s) || [],
        definition: results.SummaryInformation?.[0]?.TextSection?.Contents || results.Summary || results.Definition || undefined,
        icd10: results.ExternalReference
          ?.filter((ref: any) => ref.Source === 'ICD-10')
          ?.map((ref: any) => ref.Reference) || [],
        icd11: results.ExternalReference
          ?.filter((ref: any) => ref.Source === 'ICD-11')
          ?.map((ref: any) => ref.Reference) || [],
        omim: results.ExternalReference
          ?.filter((ref: any) => ref.Source === 'OMIM')
          ?.map((ref: any) => ref.Reference) || []
      };

      // Enrich with phenotypes, genes, and epidemiology
      const [phenotypes, genes, epidemiology] = await Promise.all([
        this.getPhenotypes(orphacode, lang),
        this.getGenes(orphacode),
        this.getEpidemiology(orphacode, lang)
      ]);

      disease.phenotypes = phenotypes;
      disease.genes = genes;
      disease.epidemiology = epidemiology;

      this.setCache(cacheKey, disease);
      return disease;
    } catch (error) {
      logger.error('Failed to fetch disease details:', error);
      return null;
    }
  }

  async getPhenotypes(orphacode: string, lang: string = 'en'): Promise<Array<{ hpoid: string; name: string; frequency?: string }> | undefined> {
    try {
      const cacheKey = `phenotypes:${orphacode}:${lang}`;
      const cached = this.getCached(cacheKey);
      if (cached) return cached;

      logger.info(`Fetching phenotypes for Orphacode: ${orphacode}`);

      const response = await fetch(
        `${this.baseUrl}/rd-phenotypes/orphacodes/${orphacode}?lang=${lang}`
      );

      if (!response.ok) {
        return undefined;
      }

      const data = await response.json();

      const phenotypes = data.HPODisorderAssociationList?.map((assoc: any) => ({
        hpoid: assoc.HPO?.HPOId || '',
        name: assoc.HPO?.HPOTerm || '',
        frequency: assoc.HPOFrequency?.Name || undefined
      })) || [];

      this.setCache(cacheKey, phenotypes);
      return phenotypes;
    } catch (error) {
      logger.error('Failed to fetch phenotypes:', error);
      return undefined;
    }
  }

  async getGenes(orphacode: string): Promise<Array<{ symbol: string; name: string; type: string }> | undefined> {
    try {
      const cacheKey = `genes:${orphacode}`;
      const cached = this.getCached(cacheKey);
      if (cached) return cached;

      logger.info(`Fetching genes for Orphacode: ${orphacode}`);

      const response = await fetch(
        `${this.baseUrl}/rd-associated-genes/orphacodes/${orphacode}`
      );

      if (!response.ok) {
        return undefined;
      }

      const data = await response.json();

      const genes = data.DisorderGeneAssociationList?.map((assoc: any) => ({
        symbol: assoc.Gene?.Symbol || '',
        name: assoc.Gene?.Name || '',
        type: assoc.DisorderGeneAssociationType?.Name || ''
      })) || [];

      this.setCache(cacheKey, genes);
      return genes;
    } catch (error) {
      logger.error('Failed to fetch genes:', error);
      return undefined;
    }
  }

  async getEpidemiology(orphacode: string, lang: string = 'en'): Promise<Array<{ prevalence: string; geographic?: string }> | undefined> {
    try {
      const cacheKey = `epidemiology:${orphacode}:${lang}`;
      const cached = this.getCached(cacheKey);
      if (cached) return cached;

      logger.info(`Fetching epidemiology for Orphacode: ${orphacode}`);

      const response = await fetch(
        `${this.baseUrl}/rd-epidemiology/orphacodes/${orphacode}?lang=${lang}`
      );

      if (!response.ok) {
        return undefined;
      }

      const data = await response.json();

      const epidemiology = data.PrevalenceList?.map((prev: any) => ({
        prevalence: prev.PrevalenceClass?.Name || prev.ValMoy || '',
        geographic: prev.PrevalenceGeographic?.Name || undefined
      })) || [];

      this.setCache(cacheKey, epidemiology);
      return epidemiology;
    } catch (error) {
      logger.error('Failed to fetch epidemiology:', error);
      return undefined;
    }
  }
}
