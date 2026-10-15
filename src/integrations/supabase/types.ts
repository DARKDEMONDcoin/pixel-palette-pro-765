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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      document_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          doc_type: string
          document_id: string
          embedding: string
          id: string
          organization_id: string
        }
        Insert: {
          chunk_index: number
          content: string
          created_at?: string
          doc_type: string
          document_id: string
          embedding: string
          id?: string
          organization_id: string
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          doc_type?: string
          document_id?: string
          embedding?: string
          id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_chunks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          chunk_count: number
          created_at: string
          doc_type: string
          error: string | null
          file_name: string
          id: string
          indexed_at: string | null
          mime_type: string | null
          organization_id: string
          size_bytes: number
          status: string
          storage_path: string
          uploaded_by: string
          workspace_id: string
        }
        Insert: {
          chunk_count?: number
          created_at?: string
          doc_type: string
          error?: string | null
          file_name: string
          id?: string
          indexed_at?: string | null
          mime_type?: string | null
          organization_id: string
          size_bytes?: number
          status?: string
          storage_path: string
          uploaded_by?: string
          workspace_id: string
        }
        Update: {
          chunk_count?: number
          created_at?: string
          doc_type?: string
          error?: string | null
          file_name?: string
          id?: string
          indexed_at?: string | null
          mime_type?: string | null
          organization_id?: string
          size_bytes?: number
          status?: string
          storage_path?: string
          uploaded_by?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_access: {
        Row: {
          created_at: string
          granted_by: string
          id: string
          organization_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by?: string
          id?: string
          organization_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string
          id?: string
          organization_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_access_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          industry: string | null
          languages: string[]
          logo_path: string | null
          name: string
          signature: string | null
          summary: Json | null
          summary_approved_at: string | null
          summary_approved_by: string | null
          summary_status: string
          website: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          industry?: string | null
          languages?: string[]
          logo_path?: string | null
          name: string
          signature?: string | null
          summary?: Json | null
          summary_approved_at?: string | null
          summary_approved_by?: string | null
          summary_status?: string
          website?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          industry?: string | null
          languages?: string[]
          logo_path?: string | null
          name?: string
          signature?: string | null
          summary?: Json | null
          summary_approved_at?: string | null
          summary_approved_by?: string | null
          summary_status?: string
          website?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      workspace_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          id: string
          invited_by: string
          role: Database["public"]["Enums"]["app_role"]
          workspace_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          id?: string
          invited_by: string
          role?: Database["public"]["Enums"]["app_role"]
          workspace_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["app_role"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_invitations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          active: boolean
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
          workspace_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
          workspace_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          cooldown_days: number
          created_at: string
          created_by: string
          id: string
          is_demo: boolean
          name: string
          outreach_paused: boolean
        }
        Insert: {
          cooldown_days?: number
          created_at?: string
          created_by: string
          id?: string
          is_demo?: boolean
          name: string
          outreach_paused?: boolean
        }
        Update: {
          cooldown_days?: number
          created_at?: string
          created_by?: string
          id?: string
          is_demo?: boolean
          name?: string
          outreach_paused?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_org: { Args: { _org: string }; Returns: boolean }
      can_edit_org: { Args: { _org: string }; Returns: boolean }
      create_workspace: { Args: { _name: string }; Returns: string }
      has_ws_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"]; _ws: string }
        Returns: boolean
      }
      is_member: { Args: { _ws: string }; Returns: boolean }
      match_org_chunks: {
        Args: { _org: string; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          doc_type: string
          document_id: string
          id: string
          similarity: number
        }[]
      }
    }
    Enums: {
      app_role: "super_admin" | "standard" | "viewer"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["super_admin", "standard", "viewer"],
    },
  },
} as const
