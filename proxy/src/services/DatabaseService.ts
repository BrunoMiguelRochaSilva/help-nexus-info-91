import { supabase } from '../config/database.js';
import logger from '../utils/logger.js';
import type { Interaction } from '../types/index.js';

export class DatabaseService {
  async saveInteraction(interaction: Interaction): Promise<number | null> {
    try {
      const { data, error } = await supabase
        .from('interactions')
        .insert(interaction)
        .select('id')
        .single();

      if (error) throw error;

      logger.info('Interaction saved:', { id: data.id });
      return data.id;
    } catch (error) {
      logger.error('Failed to save interaction:', error);
      return null;
    }
  }

  async updateMetrics(userId: string): Promise<void> {
    try {
      // First, check if metrics exist
      const { data: existing } = await supabase
        .from('metrics_profile')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existing) {
        // Update existing metrics
        const { error } = await supabase
          .from('metrics_profile')
          .update({
            total_interactions: existing.total_interactions + 1,
            last_activity: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Create new metrics record
        const { error } = await supabase
          .from('metrics_profile')
          .insert({
            user_id: userId,
            total_interactions: 1,
            last_activity: new Date().toISOString()
          });

        if (error) throw error;
      }
    } catch (error) {
      logger.error('Failed to update metrics:', error);
    }
  }

  async getInteractionHistory(userId: string, limit: number = 10): Promise<Interaction[]> {
    try {
      const { data, error } = await supabase
        .from('interactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      logger.error('Failed to fetch interaction history:', error);
      return [];
    }
  }
}
