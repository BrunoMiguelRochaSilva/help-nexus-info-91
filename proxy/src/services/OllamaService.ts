import { env } from '../config/env.js';
import logger from '../utils/logger.js';
import type { OllamaRequest, OllamaResponse, ChatMessage } from '../types/index.js';

export class OllamaService {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = env.OLLAMA_API_URL;
    this.model = env.OLLAMA_MODEL;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch (error) {
      logger.error('Ollama health check failed:', error);
      return false;
    }
  }

  async generate(prompt: string, stream: boolean = false): Promise<Response> {
    const request: OllamaRequest = {
      model: this.model,
      prompt,
      stream,
      options: {
        temperature: env.OLLAMA_TEMPERATURE,
        num_predict: env.OLLAMA_MAX_TOKENS,
        top_p: env.OLLAMA_TOP_P,
        top_k: env.OLLAMA_TOP_K,
        repeat_penalty: env.OLLAMA_REPEAT_PENALTY
        // Removed stop sequences to prevent premature truncation when listing items
      }
    };

    logger.info('Sending request to Ollama:', {
      prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
      model: this.model
    });

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  async chat(messages: ChatMessage[], stream: boolean = true): Promise<Response> {
    const prompt = this.formatChatHistory(messages);
    return this.generate(prompt, stream);
  }

  private formatChatHistory(messages: ChatMessage[]): string {
    return messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n') + '\nAssistant:';
  }

  async *streamResponse(response: Response): AsyncGenerator<string> {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error('No response body');

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const json: OllamaResponse = JSON.parse(line);
            if (json.response) {
              yield json.response;
            }
          } catch (e) {
            logger.warn('Failed to parse streaming chunk:', line);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
