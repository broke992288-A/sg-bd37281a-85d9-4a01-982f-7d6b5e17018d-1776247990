/* eslint-disable @typescript-eslint/no-empty-object-type */
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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      advice: {
        Row: {
          advice_text: string | null
          analysis_id: string | null
          created_at: string | null
          id: string
          risk_level: string | null
        }
        Insert: {
          advice_text?: string | null
          analysis_id?: string | null
          created_at?: string | null
          id?: string
          risk_level?: string | null
        }
        Update: {
          advice_text?: string | null
          analysis_id?: string | null
          created_at?: string | null
          id?: string
          risk_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advice_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_insights: {
        Row: {
          advisory_text: string | null
          created_at: string | null
          id: string
          patient_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          risk_snapshot_id: string | null
          status: string | null
        }
        Insert: {
          advisory_text?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_snapshot_id?: string | null
          status?: string | null
        }
        Update: {
          advisory_text?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_snapshot_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_insights_risk_snapshot_id_fkey"
            columns: ["risk_snapshot_id"]
            isOneToOne: false
            referencedRelation: "risk_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          created_at: string | null
          id: string
          patient_id: string | null
          risk_level: string | null
          source: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          patient_id?: string | null
          risk_level?: string | null
          source?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          patient_id?: string | null
          risk_level?: string | null
          source?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      analyses: {
        Row: {
          created_at: string | null
          extracted_data: Json | null
          file_url: string | null
          id: string
          patient_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          extracted_data?: Json | null
          file_url?: string | null
          id?: string
          patient_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          extracted_data?: Json | null
          file_url?: string | null
          id?: string
          patient_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analyses_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string | null
          created_at: string | null
          id: string
          patient_id: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      clinical_rules: {
        Row: {
          created_at: string | null
          id: string
          organ_type: string | null
          rule_config: Json | null
          rule_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organ_type?: string | null
          rule_config?: Json | null
          rule_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organ_type?: string | null
          rule_config?: Json | null
          rule_name?: string | null
        }
        Relationships: []
      }
      doctor_patients: {
        Row: {
          created_at: string | null
          doctor_id: string
          patient_id: string
        }
        Insert: {
          created_at?: string | null
          doctor_id: string
          patient_id: string
        }
        Update: {
          created_at?: string | null
          doctor_id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_patients_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      drug_changes: {
        Row: {
          advice_id: string | null
          created_at: string | null
          drug_name: string | null
          id: string
          new_dose: string | null
          old_dose: string | null
        }
        Insert: {
          advice_id?: string | null
          created_at?: string | null
          drug_name?: string | null
          id?: string
          new_dose?: string | null
          old_dose?: string | null
        }
        Update: {
          advice_id?: string | null
          created_at?: string | null
          drug_name?: string | null
          id?: string
          new_dose?: string | null
          old_dose?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drug_changes_advice_id_fkey"
            columns: ["advice_id"]
            isOneToOne: false
            referencedRelation: "advice"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_files: {
        Row: {
          created_at: string | null
          file_path: string
          id: string
          lab_result_id: string | null
          patient_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_path: string
          id?: string
          lab_result_id?: string | null
          patient_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string
          id?: string
          lab_result_id?: string | null
          patient_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_files_lab_result_id_fkey"
            columns: ["lab_result_id"]
            isOneToOne: false
            referencedRelation: "high_risk_patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_files_lab_result_id_fkey"
            columns: ["lab_result_id"]
            isOneToOne: false
            referencedRelation: "lab_results"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_files_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_results: {
        Row: {
          ai_message: string | null
          alt: number | null
          ast: number | null
          created_at: string | null
          creatinine: number | null
          episode_id: string | null
          file_url: string | null
          id: string
          measured_at: string | null
          organ_type: string | null
          patient_id: string | null
          reference_range: string | null
          risk_status: string | null
          test_code: string
          unit: string | null
          value: number | null
        }
        Insert: {
          ai_message?: string | null
          alt?: number | null
          ast?: number | null
          created_at?: string | null
          creatinine?: number | null
          episode_id?: string | null
          file_url?: string | null
          id?: string
          measured_at?: string | null
          organ_type?: string | null
          patient_id?: string | null
          reference_range?: string | null
          risk_status?: string | null
          test_code: string
          unit?: string | null
          value?: number | null
        }
        Update: {
          ai_message?: string | null
          alt?: number | null
          ast?: number | null
          created_at?: string | null
          creatinine?: number | null
          episode_id?: string | null
          file_url?: string | null
          id?: string
          measured_at?: string | null
          organ_type?: string | null
          patient_id?: string | null
          reference_range?: string | null
          risk_status?: string | null
          test_code?: string
          unit?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_results_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "transplant_episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_results_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_alerts: {
        Row: {
          alert_type: string | null
          created_at: string | null
          id: string
          message: string | null
          patient_id: string | null
        }
        Insert: {
          alert_type?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          patient_id?: string | null
        }
        Update: {
          alert_type?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          patient_id?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          birth_date: string | null
          created_at: string | null
          full_name: string
          gender: string | null
          id: string
          organ_type: string | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string | null
          full_name: string
          gender?: string | null
          id?: string
          organ_type?: string | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          organ_type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      risk_snapshots: {
        Row: {
          calculated_by: string | null
          created_at: string | null
          episode_id: string | null
          id: string
          patient_id: string | null
          risk_level: string | null
        }
        Insert: {
          calculated_by?: string | null
          created_at?: string | null
          episode_id?: string | null
          id?: string
          patient_id?: string | null
          risk_level?: string | null
        }
        Update: {
          calculated_by?: string | null
          created_at?: string | null
          episode_id?: string | null
          id?: string
          patient_id?: string | null
          risk_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_snapshots_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "transplant_episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_snapshots_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          created_at: string | null
          description: string | null
          episode_id: string | null
          event_date: string | null
          event_type: string
          id: string
          patient_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          episode_id?: string | null
          event_date?: string | null
          event_type: string
          id?: string
          patient_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          episode_id?: string | null
          event_date?: string | null
          event_type?: string
          id?: string
          patient_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "transplant_episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_events_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      transplant_episodes: {
        Row: {
          created_at: string | null
          id: string
          organ_type: string | null
          patient_id: string | null
          status: string | null
          transplant_date: string
          transplant_number: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          organ_type?: string | null
          patient_id?: string | null
          status?: string | null
          transplant_date: string
          transplant_number: number
        }
        Update: {
          created_at?: string | null
          id?: string
          organ_type?: string | null
          patient_id?: string | null
          status?: string | null
          transplant_date?: string
          transplant_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "transplant_episodes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      doctor_dashboard: {
        Row: {
          ai_message: string | null
          alt: number | null
          ast: number | null
          created_at: string | null
          full_name: string | null
          organ_type: string | null
          risk_status: string | null
        }
        Relationships: []
      }
      high_risk_patients: {
        Row: {
          alt: number | null
          ast: number | null
          created_at: string | null
          id: string | null
          organ_type: string | null
          risk_status: string | null
        }
        Insert: {
          alt?: number | null
          ast?: number | null
          created_at?: string | null
          id?: string | null
          organ_type?: string | null
          risk_status?: string | null
        }
        Update: {
          alt?: number | null
          ast?: number | null
          created_at?: string | null
          id?: string | null
          organ_type?: string | null
          risk_status?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_patient_risk: {
        Args: { alt: number; ast: number; creatinine: number; p_organ: string }
        Returns: string
      }
      calculate_risk_for_patient: {
        Args: { p_patient_id: string }
        Returns: string
      }
      calculate_risk_score: {
        Args: {
          p_albumin?: number
          p_alt?: number
          p_ast?: number
          p_bilirubin?: number
          p_creatinine?: number
          p_cyclosporine?: number
          p_egfr?: number
          p_inr?: number
          p_patient_id: string
          p_tacrolimus?: number
        }
        Returns: Json
      }
      evaluate_clinical_rules: {
        Args: { p_lab_data: Json; p_patient_id: string }
        Returns: Json
      }
      generate_ai_insights: {
        Args: { p_lab_result_id: string; p_patient_id: string }
        Returns: Json
      }
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
