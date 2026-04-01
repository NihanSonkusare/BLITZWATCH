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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          assigned_by: string | null
          created_at: string
          due_date: string | null
          employee_id: string
          id: string
          module_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          due_date?: string | null
          employee_id: string
          id?: string
          module_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          due_date?: string | null
          employee_id?: string
          id?: string
          module_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      avatar_assets: {
        Row: {
          created_at: string
          employee_id: string
          face_detected: boolean | null
          id: string
          image_height: number | null
          image_url: string
          image_width: number | null
          uploaded_by_hr_id: string | null
        }
        Insert: {
          created_at?: string
          employee_id: string
          face_detected?: boolean | null
          id?: string
          image_height?: number | null
          image_url: string
          image_width?: number | null
          uploaded_by_hr_id?: string | null
        }
        Update: {
          created_at?: string
          employee_id?: string
          face_detected?: boolean | null
          id?: string
          image_height?: number | null
          image_url?: string
          image_width?: number | null
          uploaded_by_hr_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avatar_assets_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avatar_assets_uploaded_by_hr_id_fkey"
            columns: ["uploaded_by_hr_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      episodes: {
        Row: {
          caption_url: string | null
          created_at: string
          duration_s: number | null
          episode_number: number
          id: string
          module_id: string
          quiz_timestamps: Json | null
          thumbnail_url: string | null
          video_url: string | null
        }
        Insert: {
          caption_url?: string | null
          created_at?: string
          duration_s?: number | null
          episode_number?: number
          id?: string
          module_id: string
          quiz_timestamps?: Json | null
          thumbnail_url?: string | null
          video_url?: string | null
        }
        Update: {
          caption_url?: string | null
          created_at?: string
          duration_s?: number | null
          episode_number?: number
          id?: string
          module_id?: string
          quiz_timestamps?: Json | null
          thumbnail_url?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "episodes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_jobs: {
        Row: {
          created_at: string
          current_step: number
          error_message: string | null
          file_hash: string | null
          id: string
          module_id: string
          retry_count: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_step?: number
          error_message?: string | null
          file_hash?: string | null
          id?: string
          module_id: string
          retry_count?: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_step?: number
          error_message?: string | null
          file_hash?: string | null
          id?: string
          module_id?: string
          retry_count?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_jobs_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          correct: boolean
          created_at: string
          employee_id: string
          id: string
          question_id: string
          response_time_ms: number | null
          selected_index: number | null
        }
        Insert: {
          correct?: boolean
          created_at?: string
          employee_id: string
          id?: string
          question_id: string
          response_time_ms?: number | null
          selected_index?: number | null
        }
        Update: {
          correct?: boolean
          created_at?: string
          employee_id?: string
          id?: string
          question_id?: string
          response_time_ms?: number | null
          selected_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_index: number
          created_at: string
          episode_id: string
          id: string
          options: Json
          question_text: string
          time_limit_s: number
          timestamp_s: number
        }
        Insert: {
          correct_index: number
          created_at?: string
          episode_id: string
          id?: string
          options: Json
          question_text: string
          time_limit_s?: number
          timestamp_s: number
        }
        Update: {
          correct_index?: number
          created_at?: string
          episode_id?: string
          id?: string
          options?: Json
          question_text?: string
          time_limit_s?: number
          timestamp_s?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
        ]
      }
      training_modules: {
        Row: {
          created_at: string
          created_by_hr_id: string | null
          deadline: string | null
          id: string
          script: Json | null
          source_file_hash: string | null
          source_file_url: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by_hr_id?: string | null
          deadline?: string | null
          id?: string
          script?: Json | null
          source_file_hash?: string | null
          source_file_url?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by_hr_id?: string | null
          deadline?: string | null
          id?: string
          script?: Json | null
          source_file_hash?: string | null
          source_file_url?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_modules_created_by_hr_id_fkey"
            columns: ["created_by_hr_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          department_id: string | null
          email: string
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          email: string
          full_name?: string | null
          id: string
          role: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      watch_events: {
        Row: {
          completed: boolean
          created_at: string
          employee_id: string
          episode_id: string
          id: string
          last_position_s: number
          updated_at: string
          watch_time_s: number
        }
        Insert: {
          completed?: boolean
          created_at?: string
          employee_id: string
          episode_id: string
          id?: string
          last_position_s?: number
          updated_at?: string
          watch_time_s?: number
        }
        Update: {
          completed?: boolean
          created_at?: string
          employee_id?: string
          episode_id?: string
          id?: string
          last_position_s?: number
          updated_at?: string
          watch_time_s?: number
        }
        Relationships: [
          {
            foreignKeyName: "watch_events_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watch_events_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_hr: { Args: never; Returns: boolean }
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

