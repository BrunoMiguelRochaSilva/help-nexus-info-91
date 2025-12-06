// Shared service instances to ensure single index load
import { OllamaService } from './OllamaService.js';
import { OrphadataService } from './OrphadataService.js';
import { DatabaseService } from './DatabaseService.js';

// Create singleton instances
export const ollamaService = new OllamaService();
export const orphaService = new OrphadataService();
export const dbService = new DatabaseService();
