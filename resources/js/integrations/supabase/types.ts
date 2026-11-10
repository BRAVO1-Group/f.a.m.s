export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      activities: {
        Row: {
          activity_date: string;
          arrival_time: string | null;
          attachments: Json;
          challenges: string | null;
          created_at: string;
          departure_time: string | null;
          description: string;
          id: string;
          internship_id: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          skills_gained: string[];
          solutions: string | null;
          status: Database["public"]["Enums"]["activity_status"];
          student_id: string;
          submitted_at: string | null;
          supervisor_feedback: string | null;
          title: string;
          tools_used: string[];
          updated_at: string;
        };
        Insert: {
          activity_date?: string;
          arrival_time?: string | null;
          attachments?: Json;
          challenges?: string | null;
          created_at?: string;
          departure_time?: string | null;
          description?: string;
          id?: string;
          internship_id?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          skills_gained?: string[];
          solutions?: string | null;
          status?: Database["public"]["Enums"]["activity_status"];
          student_id: string;
          submitted_at?: string | null;
          supervisor_feedback?: string | null;
          title: string;
          tools_used?: string[];
          updated_at?: string;
        };
        Update: {
          activity_date?: string;
          arrival_time?: string | null;
          attachments?: Json;
          challenges?: string | null;
          created_at?: string;
          departure_time?: string | null;
          description?: string;
          id?: string;
          internship_id?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          skills_gained?: string[];
          solutions?: string | null;
          status?: Database["public"]["Enums"]["activity_status"];
          student_id?: string;
          submitted_at?: string | null;
          supervisor_feedback?: string | null;
          title?: string;
          tools_used?: string[];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activities_internship_id_fkey";
            columns: ["internship_id"];
            isOneToOne: false;
            referencedRelation: "internships";
            referencedColumns: ["id"];
          },
        ];
      };
      attendance: {
        Row: {
          attendance_date: string;
          check_in: string | null;
          check_out: string | null;
          created_at: string;
          id: string;
          internship_id: string | null;
          notes: string | null;
          student_id: string;
          updated_at: string;
        };
        Insert: {
          attendance_date?: string;
          check_in?: string | null;
          check_out?: string | null;
          created_at?: string;
          id?: string;
          internship_id?: string | null;
          notes?: string | null;
          student_id: string;
          updated_at?: string;
        };
        Update: {
          attendance_date?: string;
          check_in?: string | null;
          check_out?: string | null;
          created_at?: string;
          id?: string;
          internship_id?: string | null;
          notes?: string | null;
          student_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attendance_internship_id_fkey";
            columns: ["internship_id"];
            isOneToOne: false;
            referencedRelation: "internships";
            referencedColumns: ["id"];
          },
        ];
      };
      internships: {
        Row: {
          created_at: string;
          department: string | null;
          end_date: string;
          id: string;
          organization_id: string | null;
          position: string;
          required_days: number;
          start_date: string;
          status: Database["public"]["Enums"]["internship_status"];
          student_id: string;
          supervisor_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          department?: string | null;
          end_date: string;
          id?: string;
          organization_id?: string | null;
          position?: string;
          required_days?: number;
          start_date: string;
          status?: Database["public"]["Enums"]["internship_status"];
          student_id: string;
          supervisor_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          department?: string | null;
          end_date?: string;
          id?: string;
          organization_id?: string | null;
          position?: string;
          required_days?: number;
          start_date?: string;
          status?: Database["public"]["Enums"]["internship_status"];
          student_id?: string;
          supervisor_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "internships_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string;
          id: string;
          kind: string;
          link: string | null;
          message: string;
          read: boolean;
          title: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          kind?: string;
          link?: string | null;
          message?: string;
          read?: boolean;
          title: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          kind?: string;
          link?: string | null;
          message?: string;
          read?: boolean;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          address: string | null;
          contact_email: string | null;
          contact_person: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          industry: string | null;
          name: string;
          updated_at: string;
          website: string | null;
        };
        Insert: {
          address?: string | null;
          contact_email?: string | null;
          contact_person?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          industry?: string | null;
          name: string;
          updated_at?: string;
          website?: string | null;
        };
        Update: {
          address?: string | null;
          contact_email?: string | null;
          contact_person?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          industry?: string | null;
          name?: string;
          updated_at?: string;
          website?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          course: string | null;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          institution: string | null;
          phone: string | null;
          student_number: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          course?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          id: string;
          institution?: string | null;
          phone?: string | null;
          student_number?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          course?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          institution?: string | null;
          phone?: string | null;
          student_number?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_admin: { Args: { _user_id: string }; Returns: boolean };
      supervises: {
        Args: { _student: string; _supervisor: string };
        Returns: boolean;
      };
    };
    Enums: {
      activity_status: "draft" | "submitted" | "approved" | "needs_correction";
      app_role: "student" | "supervisor" | "org_admin" | "uni_admin" | "system_admin";
      internship_status: "pending" | "active" | "completed" | "terminated";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      activity_status: ["draft", "submitted", "approved", "needs_correction"],
      app_role: ["student", "supervisor", "org_admin", "uni_admin", "system_admin"],
      internship_status: ["pending", "active", "completed", "terminated"],
    },
  },
} as const;
