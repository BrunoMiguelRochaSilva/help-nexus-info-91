export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  userId?: string;
  anonymousId?: string;
}

export interface OllamaRequest {
  model: string;
  prompt: string;
  stream: boolean;
  options: {
    temperature: number;
    num_predict: number;
    top_p: number;
    top_k: number;
    repeat_penalty: number;
    stop?: string[];
  };
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response?: string;
  message?: {
    role: string;
    content: string;
  };
  done: boolean;
  total_duration?: number;
  eval_count?: number;
}

export interface Interaction {
  id?: number;
  user_id?: string;
  anonymous_id?: string;
  question: string;
  answer: string;
  created_at?: Date;
}

export interface OrphaDisease {
  orphacode: string;
  name: string;
  synonyms?: string[];
  definition?: string;
  icd10?: string[];
  icd11?: string[];
  omim?: string[];
  phenotypes?: Array<{ hpoid: string; name: string; frequency?: string }>;
  genes?: Array<{ symbol: string; name: string; type: string }>;
  epidemiology?: Array<{ prevalence: string; geographic?: string }>;
}
