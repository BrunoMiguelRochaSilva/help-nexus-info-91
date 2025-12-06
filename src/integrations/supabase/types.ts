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
      discussion_likes: {
        Row: {
          created_at: string
          discussion_id: string
          id: string
          user_identifier: string
        }
        Insert: {
          created_at?: string
          discussion_id: string
          id?: string
          user_identifier: string
        }
        Update: {
          created_at?: string
          discussion_id?: string
          id?: string
          user_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_likes_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          author_name: string
          body: string
          created_at: string
          id: string
          is_hidden: boolean | null
          is_reported: boolean | null
          likes_count: number
          replies_count: number
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string
          body: string
          created_at?: string
          id?: string
          is_hidden?: boolean | null
          is_reported?: boolean | null
          likes_count?: number
          replies_count?: number
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          is_hidden?: boolean | null
          is_reported?: boolean | null
          likes_count?: number
          replies_count?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          comment: string | null
          created_at: string
          id: number
          rating: number
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: number
          rating: number
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: number
          rating?: number
          user_id?: string | null
        }
        Relationships: []
      }
      replies: {
        Row: {
          author_name: string
          body: string
          created_at: string
          discussion_id: string
          id: string
          is_hidden: boolean | null
          is_reported: boolean | null
          likes_count: number
        }
        Insert: {
          author_name?: string
          body: string
          created_at?: string
          discussion_id: string
          id?: string
          is_hidden?: boolean | null
          is_reported?: boolean | null
          likes_count?: number
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          discussion_id?: string
          id?: string
          is_hidden?: boolean | null
          is_reported?: boolean | null
          likes_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      reply_likes: {
        Row: {
          created_at: string
          id: string
          reply_id: string
          user_identifier: string
        }
        Insert: {
          created_at?: string
          id?: string
          reply_id: string
          user_identifier: string
        }
        Update: {
          created_at?: string
          id?: string
          reply_id?: string
          user_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "reply_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "replies"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          age_range: string | null
          appointment_frequency: string | null
          area_of_residence: string | null
          country: string | null
          created_at: string
          discovery_source: string | null
          disease_name: string | null
          has_other_chronic_conditions: string | null
          id: string
          main_device: string | null
          main_medical_followup: string | null
          main_needs: string[] | null
          mother_tongue: string | null
          mother_tongue_other: string | null
          orpha_code: string | null
          patient_association_support: string | null
          relationship_with_condition: string | null
          tech_comfort: string | null
          time_since_diagnosis: string | null
        }
        Insert: {
          age_range?: string | null
          appointment_frequency?: string | null
          area_of_residence?: string | null
          country?: string | null
          created_at?: string
          discovery_source?: string | null
          disease_name?: string | null
          has_other_chronic_conditions?: string | null
          id?: string
          main_device?: string | null
          main_medical_followup?: string | null
          main_needs?: string[] | null
          mother_tongue?: string | null
          mother_tongue_other?: string | null
          orpha_code?: string | null
          patient_association_support?: string | null
          relationship_with_condition?: string | null
          tech_comfort?: string | null
          time_since_diagnosis?: string | null
        }
        Update: {
          age_range?: string | null
          appointment_frequency?: string | null
          area_of_residence?: string | null
          country?: string | null
          created_at?: string
          discovery_source?: string | null
          disease_name?: string | null
          has_other_chronic_conditions?: string | null
          id?: string
          main_device?: string | null
          main_medical_followup?: string | null
          main_needs?: string[] | null
          mother_tongue?: string | null
          mother_tongue_other?: string | null
          orpha_code?: string | null
          patient_association_support?: string | null
          relationship_with_condition?: string | null
          tech_comfort?: string | null
          time_since_diagnosis?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
