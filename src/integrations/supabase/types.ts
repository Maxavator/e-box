export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      calendar_events: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          end_time: string
          id: string
          is_online: boolean | null
          location: string | null
          meeting_link: string | null
          start_time: string
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          end_time: string
          id?: string
          is_online?: boolean | null
          location?: string | null
          meeting_link?: string | null
          start_time: string
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_time?: string
          id?: string
          is_online?: boolean | null
          location?: string | null
          meeting_link?: string | null
          start_time?: string
          title?: string
        }
        Relationships: []
      }
      calendar_invites: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          invitee_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          invitee_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          invitee_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_invites_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_tasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          due_date: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          contact_id: string
          created_at: string | null
          id: string
          is_favorite: boolean | null
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          content_type: string | null
          created_at: string | null
          description: string | null
          file_path: string | null
          id: string
          is_verified: boolean | null
          last_modified_by: string | null
          name: string
          requires_otp: boolean | null
          size: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          category?: string | null
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          id?: string
          is_verified?: boolean | null
          last_modified_by?: string | null
          name: string
          requires_otp?: boolean | null
          size?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          category?: string | null
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          file_path?: string | null
          id?: string
          is_verified?: boolean | null
          last_modified_by?: string | null
          name?: string
          requires_otp?: boolean | null
          size?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      leave_balances: {
        Row: {
          annual_days_total: number | null
          annual_days_used: number | null
          created_at: string | null
          id: string
          maternity_days_total: number | null
          maternity_days_used: number | null
          paternity_days_total: number | null
          paternity_days_used: number | null
          sick_days_total: number | null
          sick_days_used: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          annual_days_total?: number | null
          annual_days_used?: number | null
          created_at?: string | null
          id?: string
          maternity_days_total?: number | null
          maternity_days_used?: number | null
          paternity_days_total?: number | null
          paternity_days_used?: number | null
          sick_days_total?: number | null
          sick_days_used?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          annual_days_total?: number | null
          annual_days_used?: number | null
          created_at?: string | null
          id?: string
          maternity_days_total?: number | null
          maternity_days_used?: number | null
          paternity_days_total?: number | null
          paternity_days_used?: number | null
          sick_days_total?: number | null
          sick_days_used?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason: string | null
          start_date: string
          status: Database["public"]["Enums"]["leave_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          reason?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          domain: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      partner_messages: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          receiver_id: string
          sender_id: string
          subject: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          receiver_id: string
          sender_id: string
          subject: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          receiver_id?: string
          sender_id?: string
          subject?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          calendar_notification_time: number | null
          created_at: string | null
          default_notification_time: number | null
          first_name: string | null
          id: string
          last_name: string | null
          organization_id: string | null
          phone_number: string | null
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          calendar_notification_time?: number | null
          created_at?: string | null
          default_notification_time?: number | null
          first_name?: string | null
          id: string
          last_name?: string | null
          organization_id?: string | null
          phone_number?: string | null
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          calendar_notification_time?: number | null
          created_at?: string | null
          default_notification_time?: number | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization_id?: string | null
          phone_number?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          leave_status: Database["public"]["Enums"]["leave_status"][] | null
          leave_type: Database["public"]["Enums"]["leave_type"][] | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          leave_status?: Database["public"]["Enums"]["leave_status"][] | null
          leave_type?: Database["public"]["Enums"]["leave_type"][] | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          leave_status?: Database["public"]["Enums"]["leave_status"][] | null
          leave_type?: Database["public"]["Enums"]["leave_type"][] | null
          role?: Database["public"]["Enums"]["user_role"]
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
      leave_status: "pending" | "approved" | "rejected"
      leave_type: "annual" | "sick" | "maternity" | "paternity"
      user_role: "global_admin" | "org_admin" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
