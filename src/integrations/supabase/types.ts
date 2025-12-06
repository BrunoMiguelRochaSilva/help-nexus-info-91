export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      feedback: {
        Row: {
          comment: string | null
          created_at: string | null
          id: number
          interaction_id: number | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: number
          interaction_id?: number | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: number
          interaction_id?: number | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_interaction_id_fkey"
            columns: ["interaction_id"]
            isOneToOne: false
            referencedRelation: "admin_interactions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_interaction_id_fkey"
            columns: ["interaction_id"]
            isOneToOne: false
            referencedRelation: "interactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interactions: {
        Row: {
          anonymous_id: string | null
          answer: string
          created_at: string | null
          id: number
          question: string
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          answer: string
          created_at?: string | null
          id?: number
          question: string
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          answer?: string
          created_at?: string | null
          id?: number
          question?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics_global: {
        Row: {
          collected_at: string | null
          country: string | null
          disease_name: string | null
          id: number
          metric_type: string
          search_count: number | null
          user_count: number | null
          value: number | null
        }
        Insert: {
          collected_at?: string | null
          country?: string | null
          disease_name?: string | null
          id?: never
          metric_type: string
          search_count?: number | null
          user_count?: number | null
          value?: number | null
        }
        Update: {
          collected_at?: string | null
          country?: string | null
          disease_name?: string | null
          id?: never
          metric_type?: string
          search_count?: number | null
          user_count?: number | null
          value?: number | null
        }
        Relationships: []
      }
      metrics_profile: {
        Row: {
          created_at: string | null
          device_type: string | null
          favorite_disease: string | null
          id: number
          last_activity: string | null
          notes: string | null
          session_count: number | null
          total_interactions: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_type?: string | null
          favorite_disease?: string | null
          id?: never
          last_activity?: string | null
          notes?: string | null
          session_count?: number | null
          total_interactions?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_type?: string | null
          favorite_disease?: string | null
          id?: never
          last_activity?: string | null
          notes?: string | null
          session_count?: number | null
          total_interactions?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "metrics_profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          country: string | null
          created_at: string | null
          disease: string | null
          email: string
          full_name: string | null
          id: string
          preferred_language: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          age?: number | null
          country?: string | null
          created_at?: string | null
          disease?: string | null
          email: string
          full_name?: string | null
          id: string
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          age?: number | null
          country?: string | null
          created_at?: string | null
          disease?: string | null
          email?: string
          full_name?: string | null
          id?: string
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          identifier: string
          last_submission: string | null
          submission_count: number | null
          window_start: string | null
        }
        Insert: {
          identifier: string
          last_submission?: string | null
          submission_count?: number | null
          window_start?: string | null
        }
        Update: {
          identifier?: string
          last_submission?: string | null
          submission_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          field_name: string
          id: number
          language: string
          record_id: number
          table_name: string
          translated_text: string
        }
        Insert: {
          field_name: string
          id?: number
          language: string
          record_id: number
          table_name: string
          translated_text: string
        }
        Update: {
          field_name?: string
          id?: number
          language?: string
          record_id?: number
          table_name?: string
          translated_text?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_interactions_view: {
        Row: {
          age: number | null
          anonymous_id: string | null
          answer: string | null
          country: string | null
          created_at: string | null
          disease: string | null
          email: string | null
          full_name: string | null
          id: number | null
          question: string | null
          user_id: string | null
          user_type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      disease_search_metrics: {
        Row: {
          country: string | null
          disease_name: string | null
          last_searched: string | null
          total_searches: number | null
        }
        Relationships: []
      }
      disease_search_metrics_view: {
        Row: {
          country: string | null
          disease_name: string | null
          last_searched: string | null
          total_searches: number | null
        }
        Relationships: []
      }
      system_metrics_summary: {
        Row: {
          anonymous_interactions: number | null
          average_rating: number | null
          interactions_last_30_days: number | null
          interactions_last_7_days: number | null
          registered_interactions: number | null
          total_feedback: number | null
          total_registered_users: number | null
          unique_anonymous_sessions: number | null
        }
        Relationships: []
      }
      users_by_country_view: {
        Row: {
          country: string | null
          recent_users: number | null
          user_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_old_anonymous_interactions: { Args: never; Returns: undefined }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { user_id: string }; Returns: boolean }
      refresh_disease_metrics: { Args: never; Returns: undefined }
      track_disease_search: {
        Args: { p_country?: string; p_disease_name: string }
        Returns: undefined
      }
      update_profile_metrics: {
        Args: { p_disease?: string; p_user_id: string }
        Returns: undefined
      }
      update_user_count_metric: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user"
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      user_role: ["user", "admin"],
    },
  },
} as const
