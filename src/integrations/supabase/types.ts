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
      atividades: {
        Row: {
          created_at: string
          descricao: string | null
          foto_url: string | null
          id: string
          local: string
          nome: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          foto_url?: string | null
          id?: string
          local: string
          nome: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          foto_url?: string | null
          id?: string
          local?: string
          nome?: string
        }
        Relationships: []
      }
      atividades_itinerario: {
        Row: {
          atividade_id: string
          created_at: string
          dia: number
          horario: string | null
          id: string
          itinerario_id: string
          ordem: number
        }
        Insert: {
          atividade_id: string
          created_at?: string
          dia: number
          horario?: string | null
          id?: string
          itinerario_id: string
          ordem?: number
        }
        Update: {
          atividade_id?: string
          created_at?: string
          dia?: number
          horario?: string | null
          id?: string
          itinerario_id?: string
          ordem?: number
        }
        Relationships: [
          {
            foreignKeyName: "atividades_itinerario_atividade_id_fkey"
            columns: ["atividade_id"]
            isOneToOne: false
            referencedRelation: "atividades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atividades_itinerario_itinerario_id_fkey"
            columns: ["itinerario_id"]
            isOneToOne: false
            referencedRelation: "itinerarios"
            referencedColumns: ["id"]
          },
        ]
      }
      atividades_roteiro: {
        Row: {
          atividade_id: string
          created_at: string
          id: string
          ordem: number
          roteiro_id: string
        }
        Insert: {
          atividade_id: string
          created_at?: string
          id?: string
          ordem?: number
          roteiro_id: string
        }
        Update: {
          atividade_id?: string
          created_at?: string
          id?: string
          ordem?: number
          roteiro_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "atividades_roteiro_atividade_id_fkey"
            columns: ["atividade_id"]
            isOneToOne: false
            referencedRelation: "atividades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atividades_roteiro_roteiro_id_fkey"
            columns: ["roteiro_id"]
            isOneToOne: false
            referencedRelation: "roteiros"
            referencedColumns: ["id"]
          },
        ]
      }
      avaliacoes: {
        Row: {
          atividade_id: string
          comentario: string | null
          created_at: string
          id: string
          itinerario_id: string
          nota: number
          user_id: string
        }
        Insert: {
          atividade_id: string
          comentario?: string | null
          created_at?: string
          id?: string
          itinerario_id: string
          nota: number
          user_id: string
        }
        Update: {
          atividade_id?: string
          comentario?: string | null
          created_at?: string
          id?: string
          itinerario_id?: string
          nota?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_atividade_id_fkey"
            columns: ["atividade_id"]
            isOneToOne: false
            referencedRelation: "atividades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_itinerario_id_fkey"
            columns: ["itinerario_id"]
            isOneToOne: false
            referencedRelation: "itinerarios"
            referencedColumns: ["id"]
          },
        ]
      }
      comentarios: {
        Row: {
          created_at: string
          id: string
          publicacao_id: string
          texto: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          publicacao_id: string
          texto: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          publicacao_id?: string
          texto?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comentarios_publicacao_id_fkey"
            columns: ["publicacao_id"]
            isOneToOne: false
            referencedRelation: "publicacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      favoritos: {
        Row: {
          created_at: string
          id: string
          itinerario_id: string | null
          roteiro_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          itinerario_id?: string | null
          roteiro_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          itinerario_id?: string | null
          roteiro_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_itinerario_id_fkey"
            columns: ["itinerario_id"]
            isOneToOne: false
            referencedRelation: "itinerarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favoritos_roteiro_id_fkey"
            columns: ["roteiro_id"]
            isOneToOne: false
            referencedRelation: "roteiros"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerarios: {
        Row: {
          created_at: string
          data_fim: string
          data_inicio: string
          descricao: string | null
          dias: number | null
          id: string
          local: string | null
          roteiro_id: string | null
          status: string | null
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_fim: string
          data_inicio: string
          descricao?: string | null
          dias?: number | null
          id?: string
          local?: string | null
          roteiro_id?: string | null
          status?: string | null
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          dias?: number | null
          id?: string
          local?: string | null
          roteiro_id?: string | null
          status?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerarios_roteiro_id_fkey"
            columns: ["roteiro_id"]
            isOneToOne: false
            referencedRelation: "roteiros"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          nome: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      publicacoes: {
        Row: {
          created_at: string
          foto_url: string | null
          id: string
          texto: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          foto_url?: string | null
          id?: string
          texto: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          foto_url?: string | null
          id?: string
          texto?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      roteiros: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          titulo?: string
          updated_at?: string
          user_id?: string
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
