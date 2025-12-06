import { Router, Request, Response } from 'express';
import { ollamaService, orphaService, dbService } from '../services/index.js';
import { validateChatRequest } from '../middleware/validator.js';
import { checkRateLimit } from '../middleware/rateLimit.js';
import logger from '../utils/logger.js';
import { extractDiseaseName } from '../utils/diseaseExtractor.js';
import type { ChatRequest, ChatMessage } from '../types/index.js';

const router = Router();

router.post('/chat', validateChatRequest, async (req: Request, res: Response) => {
  const { message, history = [], userId, anonymousId }: ChatRequest = req.body;

  // Rate limiting
  const identifier = userId || anonymousId || req.ip || 'unknown';
  const allowed = await checkRateLimit(identifier);

  if (!allowed) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  try {
    let fullResponse = '';
    const startTime = Date.now();

    // Check if this is a simple confirmation (yes/no) to a previous question
    const isConfirmation = /^(sim|yes|yeah|yep|ok|okay|claro|s|y)$/i.test(message.trim());

    let extractedDiseaseName: string | null = null;

    // If it's a confirmation, look in conversation history first
    if (isConfirmation && history.length > 0) {
      // Look for disease mentions in the last assistant message
      const lastAssistantMsg = history.slice().reverse().find(msg => msg.role === 'assistant');
      if (lastAssistantMsg) {
        extractedDiseaseName = extractDiseaseName(lastAssistantMsg.content);
        if (extractedDiseaseName) {
          logger.info(`User confirmed interest in previously mentioned disease: ${extractedDiseaseName}`);
        }
      }
    }

    // If not a confirmation or no disease found in history, extract from current message
    if (!extractedDiseaseName) {
      extractedDiseaseName = extractDiseaseName(message);
    }

    // Filter out common greetings and short words that aren't diseases
    const isGreeting = /^(ola|olá|oi|hi|hello|hey|bom dia|boa tarde|boa noite|good morning|good afternoon|good evening)$/i.test(message.trim());
    if (isGreeting || (extractedDiseaseName && extractedDiseaseName.length <= 3)) {
      extractedDiseaseName = null;
    }

    logger.info(`Extracted disease name: ${extractedDiseaseName || 'none'} from: ${message}`);

    // Try to find disease info from Orphadata
    let diseaseInfo = null;
    if (extractedDiseaseName) {
      diseaseInfo = await orphaService.searchDisease(extractedDiseaseName);
    }

    // Setup SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    if (diseaseInfo) {
      // Build context from Orphadata for Ollama
      logger.info(`Found disease info for: ${diseaseInfo.name} (ORPHA:${diseaseInfo.orphacode})`);

      let context = `You are a medical information assistant. Answer the user's question using the verified disease information from Orphadata below.\n\n`;

      context += `Disease Information:\n`;
      context += `- Name: ${diseaseInfo.name}\n`;
      context += `- Orphacode: ORPHA:${diseaseInfo.orphacode}\n`;

      if (diseaseInfo.definition) {
        context += `- Definition: ${diseaseInfo.definition}\n`;
      }

      if (diseaseInfo.synonyms && diseaseInfo.synonyms.length > 0) {
        context += `- Also known as: ${diseaseInfo.synonyms.join(', ')}\n`;
      }

      if (diseaseInfo.icd10 && diseaseInfo.icd10.length > 0) {
        context += `- ICD-10 codes: ${diseaseInfo.icd10.join(', ')}\n`;
      }

      if (diseaseInfo.icd11 && diseaseInfo.icd11.length > 0) {
        context += `- ICD-11 codes: ${diseaseInfo.icd11.join(', ')}\n`;
      }

      if (diseaseInfo.omim && diseaseInfo.omim.length > 0) {
        context += `- OMIM references: ${diseaseInfo.omim.join(', ')}\n`;
      }

      if (diseaseInfo.genes && diseaseInfo.genes.length > 0) {
        context += `- Associated genes: ${diseaseInfo.genes.map(g => `${g.symbol} (${g.type})`).join(', ')}\n`;
      }

      if (diseaseInfo.phenotypes && diseaseInfo.phenotypes.length > 0) {
        const topPhenotypes = diseaseInfo.phenotypes.slice(0, 10);
        context += `- Common symptoms/phenotypes: ${topPhenotypes.map(p => p.name).join(', ')}\n`;
      }

      if (diseaseInfo.epidemiology && diseaseInfo.epidemiology.length > 0) {
        context += `- Prevalence: ${diseaseInfo.epidemiology.map(e => e.prevalence).join(', ')}\n`;
      }

      context += `\nUser question: ${message}\n\n`;

      // Detect language from user message and conversation history
      const hasPortugueseChars = /[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(message);
      const hasPortugueseWords = /\b(ola|olá|sim|nao|não|como|que|doença|doenças|rara|raras|sobre|ajud|obrigad|quais|qual|sao|são|sintomas|ela|dele|disso|isso|esta|está)\b/i.test(message);

      // Check if previous messages were in Portuguese
      const historyInPortuguese = history.some(msg =>
        /[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(msg.content) ||
        /\b(doença|doenças|sintomas|é|são)\b/i.test(msg.content)
      );

      const isPortuguese = hasPortugueseChars || hasPortugueseWords || historyInPortuguese;

      if (isPortuguese) {
        context += `REGRA ABSOLUTA: Responde em PORTUGUÊS FORMAL de PORTUGAL (PT-PT).
- Tom PROFISSIONAL e CORRETO, adequado a informação médica
- Usa terceira pessoa ou formas impessoais
- Exemplos CORRETOS: "Esta doença caracteriza-se por...", "Os sintomas incluem...", "É importante consultar..."
- NUNCA uses "tu perguntou", "tu tens", "tu estás" (informal/incorreto)
- NUNCA uses português brasileiro: "você", "a gente", "está bom"
- Linguagem clara, formal, técnica quando apropriado
- Sem gírias, sem informalidades
- IMPORTANTE: No final da resposta, adiciona: "ℹ️ Mais informações: https://www.orpha.net/pt/disease/detail/${diseaseInfo.orphacode}"\n`;
      } else {
        context += `ABSOLUTE RULE: Respond in FORMAL ENGLISH.
- Professional and correct tone for medical information
- Use third person or impersonal forms
- Examples: "This disease is characterized by...", "Symptoms include..."
- Medical terminology when appropriate
- Clear, formal language
- IMPORTANT: At the end of your response, add: "ℹ️ More information: https://www.orpha.net/en/disease/detail/${diseaseInfo.orphacode}"\n`;
      }

      // Include conversation history for context
      const messages: ChatMessage[] = [
        ...history.slice(-3), // Last 3 messages for context
        { role: 'user', content: context }
      ];

      const ollamaResponse = await ollamaService.chat(messages, true);

      // Stream response
      for await (const chunk of ollamaService.streamResponse(ollamaResponse)) {
        fullResponse += chunk;
        res.write(`data: ${JSON.stringify({ content: chunk, done: false })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ content: '', done: true })}\n\n`);
      res.end();
    } else {
      // No disease info found, use Ollama with conversation history
      logger.info('No Orphadata result found, using Ollama with general knowledge');

      // Detect language from user message and conversation history
      const hasPortugueseChars = /[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(message);
      const hasPortugueseWords = /\b(ola|olá|sim|nao|não|como|que|doença|doenças|rara|raras|sobre|ajud|obrigad|quais|qual|sao|são|sintomas|ela|dele|disso|isso|esta|está)\b/i.test(message);

      // Check if previous messages were in Portuguese
      const historyInPortuguese = history.some(msg =>
        /[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(msg.content) ||
        /\b(doença|doenças|sintomas|é|são)\b/i.test(msg.content)
      );

      const isPortuguese = hasPortugueseChars || hasPortugueseWords || historyInPortuguese;

      // Add system prompt with language rule
      const systemPrompt: ChatMessage = {
        role: 'user',
        content: isPortuguese ?
        `És um assistente de informação sobre doenças raras baseado APENAS em informação verificada da Orphadata.
REGRAS CRÍTICAS:
- Se NÃO tiveres informação verificada, diz: "Lamento, mas não tenho informação verificada sobre esta condição na base de dados Orphadata. Recomendo que consulte um médico especialista ou geneticista para informação fidedigna."
- NUNCA inventes ou alucinies informação médica
- Apenas responde se tiveres dados concretos
- Responde em PORTUGUÊS FORMAL de PORTUGAL (PT-PT)
- Tom profissional: "Esta doença...", "Os sintomas incluem...", "É recomendado..."
- NUNCA uses "tu perguntou", "tu tens" (informal/incorreto)
- NUNCA uses português brasileiro: "você", "a gente"`
        :
        `You are a rare disease information assistant based ONLY on verified information from Orphadata.
CRITICAL RULES:
- If you DON'T have verified information, say: "I'm sorry, but I don't have verified information about this condition in the Orphadata database. I recommend consulting a specialist doctor or geneticist for reliable information."
- NEVER make up or hallucinate medical information
- Only answer if you have concrete data
- Respond in FORMAL ENGLISH
- Professional tone: "This disease...", "Symptoms include...", "It is recommended..."`
      };

      // Use conversation history for context, but allow new topics freely
      const messages: ChatMessage[] = [
        systemPrompt,
        ...history.slice(-3), // Last 3 messages for context
        { role: 'user', content: message }
      ];

      const ollamaResponse = await ollamaService.chat(messages, true);

      // Stream response
      for await (const chunk of ollamaService.streamResponse(ollamaResponse)) {
        fullResponse += chunk;
        res.write(`data: ${JSON.stringify({ content: chunk, done: false })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ content: '', done: true })}\n\n`);
      res.end();
    }

    // Save interaction to database
    const duration = Date.now() - startTime;
    await dbService.saveInteraction({
      user_id: userId,
      anonymous_id: anonymousId,
      question: message,
      answer: fullResponse
    });

    if (userId) {
      await dbService.updateMetrics(userId);
    }

    logger.info('Chat completed', { duration, userId, responseLength: fullResponse.length });

  } catch (error) {
    logger.error('Chat route error:', error);

    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to process chat request' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted', done: true })}\n\n`);
      res.end();
    }
  }
});

export default router;
