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
      features: {
        Row: {
          created_at: string
          description: string | null
          key: string
          kind: Database["public"]["Enums"]["feature_kind"]
          name: string
          sort_order: number
          unit: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          key: string
          kind: Database["public"]["Enums"]["feature_kind"]
          name: string
          sort_order?: number
          unit?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          key?: string
          kind?: Database["public"]["Enums"]["feature_kind"]
          name?: string
          sort_order?: number
          unit?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string
          currency: string
          due_at: string | null
          id: string
          interval: Database["public"]["Enums"]["billing_interval"] | null
          number: string
          paid_at: string | null
          period_end: string | null
          period_start: string | null
          plan_id: string | null
          school_id: string
          status: Database["public"]["Enums"]["invoice_status"]
          subscription_id: string | null
          subtotal_minor: number
          tax_minor: number
          total_minor: number | null
        }
        Insert: {
          created_at?: string
          currency?: string
          due_at?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["billing_interval"] | null
          number?: string
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          plan_id?: string | null
          school_id: string
          status?: Database["public"]["Enums"]["invoice_status"]
          subscription_id?: string | null
          subtotal_minor: number
          tax_minor?: number
          total_minor?: number | null
        }
        Update: {
          created_at?: string
          currency?: string
          due_at?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["billing_interval"] | null
          number?: string
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          plan_id?: string | null
          school_id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
          subscription_id?: string | null
          subtotal_minor?: number
          tax_minor?: number
          total_minor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_webhook_events: {
        Row: {
          error: string | null
          event_id: string
          event_type: string | null
          id: string
          payload: Json
          processed_at: string | null
          provider: string
          received_at: string
          signature_valid: boolean
        }
        Insert: {
          error?: string | null
          event_id: string
          event_type?: string | null
          id?: string
          payload: Json
          processed_at?: string | null
          provider: string
          received_at?: string
          signature_valid: boolean
        }
        Update: {
          error?: string | null
          event_id?: string
          event_type?: string | null
          id?: string
          payload?: Json
          processed_at?: string | null
          provider?: string
          received_at?: string
          signature_valid?: boolean
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_minor: number
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          invoice_id: string | null
          provider: string
          provider_payload: Json | null
          provider_reference: string
          receipt_number: string | null
          school_id: string
          status: Database["public"]["Enums"]["payment_status"]
          verified_at: string | null
        }
        Insert: {
          amount_minor: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          invoice_id?: string | null
          provider: string
          provider_payload?: Json | null
          provider_reference: string
          receipt_number?: string | null
          school_id: string
          status?: Database["public"]["Enums"]["payment_status"]
          verified_at?: string | null
        }
        Update: {
          amount_minor?: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          invoice_id?: string | null
          provider?: string
          provider_payload?: Json | null
          provider_reference?: string
          receipt_number?: string | null
          school_id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_entitlements: {
        Row: {
          enabled: boolean
          feature_key: string
          is_unlimited: boolean
          limit_value: number | null
          plan_id: string
        }
        Insert: {
          enabled?: boolean
          feature_key: string
          is_unlimited?: boolean
          limit_value?: number | null
          plan_id: string
        }
        Update: {
          enabled?: boolean
          feature_key?: string
          is_unlimited?: boolean
          limit_value?: number | null
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_entitlements_feature_key_fkey"
            columns: ["feature_key"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "plan_entitlements_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_prices: {
        Row: {
          amount_minor: number
          created_at: string
          currency: string
          id: string
          interval: Database["public"]["Enums"]["billing_interval"]
          is_active: boolean
          plan_id: string
          provider_refs: Json
        }
        Insert: {
          amount_minor: number
          created_at?: string
          currency?: string
          id?: string
          interval: Database["public"]["Enums"]["billing_interval"]
          is_active?: boolean
          plan_id: string
          provider_refs?: Json
        }
        Update: {
          amount_minor?: number
          created_at?: string
          currency?: string
          id?: string
          interval?: Database["public"]["Enums"]["billing_interval"]
          is_active?: boolean
          plan_id?: string
          provider_refs?: Json
        }
        Relationships: [
          {
            foreignKeyName: "plan_prices_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_public: boolean
          name: string
          sort_order: number
          tier_rank: number
          trial_days: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          name: string
          sort_order?: number
          tier_rank?: number
          trial_days?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          name?: string
          sort_order?: number
          tier_rank?: number
          trial_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      platform_admins: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_announcements: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          ends_at: string | null
          id: string
          is_published: boolean
          severity: string
          starts_at: string
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          is_published?: boolean
          severity?: string
          starts_at?: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          ends_at?: string | null
          id?: string
          is_published?: boolean
          severity?: string
          starts_at?: string
          title?: string
        }
        Relationships: []
      }
      platform_audit_log: {
        Row: {
          action: string
          actor: string | null
          created_at: string
          id: number
          metadata: Json
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          actor?: string | null
          created_at?: string
          id?: never
          metadata?: Json
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          actor?: string | null
          created_at?: string
          id?: never
          metadata?: Json
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      school_entitlement_overrides: {
        Row: {
          created_at: string
          created_by: string | null
          enabled: boolean
          expires_at: string | null
          feature_key: string
          is_unlimited: boolean
          limit_value: number | null
          reason: string | null
          school_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          expires_at?: string | null
          feature_key: string
          is_unlimited?: boolean
          limit_value?: number | null
          reason?: string | null
          school_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          expires_at?: string | null
          feature_key?: string
          is_unlimited?: boolean
          limit_value?: number | null
          reason?: string | null
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_entitlement_overrides_feature_key_fkey"
            columns: ["feature_key"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "school_entitlement_overrides_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["school_role"]
          school_id: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["school_role"]
          school_id: string
          token?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["school_role"]
          school_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_invitations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_members: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["school_role"]
          school_id: string
          status: Database["public"]["Enums"]["member_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["school_role"]
          school_id: string
          status?: Database["public"]["Enums"]["member_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["school_role"]
          school_id?: string
          status?: Database["public"]["Enums"]["member_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_members_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          contact_email: string
          contact_phone: string | null
          country: string
          created_at: string
          created_by: string | null
          id: string
          name: string
          onboarding_completed: boolean
          slug: string
          status: Database["public"]["Enums"]["school_status"]
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          address?: string | null
          contact_email: string
          contact_phone?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          onboarding_completed?: boolean
          slug: string
          status?: Database["public"]["Enums"]["school_status"]
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string
          contact_phone?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          onboarding_completed?: boolean
          slug?: string
          status?: Database["public"]["Enums"]["school_status"]
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      subscription_events: {
        Row: {
          actor: string | null
          created_at: string
          event_type: string
          from_plan_id: string | null
          from_status: Database["public"]["Enums"]["subscription_status"] | null
          id: number
          metadata: Json
          school_id: string
          subscription_id: string | null
          to_plan_id: string | null
          to_status: Database["public"]["Enums"]["subscription_status"] | null
        }
        Insert: {
          actor?: string | null
          created_at?: string
          event_type: string
          from_plan_id?: string | null
          from_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          id?: never
          metadata?: Json
          school_id: string
          subscription_id?: string | null
          to_plan_id?: string | null
          to_status?: Database["public"]["Enums"]["subscription_status"] | null
        }
        Update: {
          actor?: string | null
          created_at?: string
          event_type?: string
          from_plan_id?: string | null
          from_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          id?: never
          metadata?: Json
          school_id?: string
          subscription_id?: string | null
          to_plan_id?: string | null
          to_status?: Database["public"]["Enums"]["subscription_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_events_from_plan_id_fkey"
            columns: ["from_plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_events_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_events_to_plan_id_fkey"
            columns: ["to_plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_policy: {
        Row: {
          default_currency: string
          expired_access_mode: string
          grace_period_days: number
          id: boolean
          trial_auto_approve: boolean
          updated_at: string
        }
        Insert: {
          default_currency?: string
          expired_access_mode?: string
          grace_period_days?: number
          id?: boolean
          trial_auto_approve?: boolean
          updated_at?: string
        }
        Update: {
          default_currency?: string
          expired_access_mode?: string
          grace_period_days?: number
          id?: boolean
          trial_auto_approve?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          cancelled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          grace_ends_at: string | null
          id: string
          interval: Database["public"]["Enums"]["billing_interval"] | null
          pending_plan_id: string | null
          pending_plan_price_id: string | null
          plan_id: string
          plan_price_id: string | null
          provider: string | null
          provider_subscription_ref: string | null
          school_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          grace_ends_at?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["billing_interval"] | null
          pending_plan_id?: string | null
          pending_plan_price_id?: string | null
          plan_id: string
          plan_price_id?: string | null
          provider?: string | null
          provider_subscription_ref?: string | null
          school_id: string
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          cancel_at_period_end?: boolean
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          grace_ends_at?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["billing_interval"] | null
          pending_plan_id?: string | null
          pending_plan_price_id?: string | null
          plan_id?: string
          plan_price_id?: string | null
          provider?: string | null
          provider_subscription_ref?: string | null
          school_id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_pending_plan_id_fkey"
            columns: ["pending_plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_pending_plan_price_id_fkey"
            columns: ["pending_plan_price_id"]
            isOneToOne: false
            referencedRelation: "plan_prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_price_id_fkey"
            columns: ["plan_price_id"]
            isOneToOne: false
            referencedRelation: "plan_prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          body: string
          created_at: string
          id: string
          opened_by: string | null
          school_id: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          body: string
          created_at?: string
          id?: string
          opened_by?: string | null
          school_id?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          body?: string
          created_at?: string
          id?: string
          opened_by?: string | null
          school_id?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_counters: {
        Row: {
          feature_key: string
          period_start: string
          school_id: string
          updated_at: string
          used: number
        }
        Insert: {
          feature_key: string
          period_start: string
          school_id: string
          updated_at?: string
          used?: number
        }
        Update: {
          feature_key?: string
          period_start?: string
          school_id?: string
          updated_at?: string
          used?: number
        }
        Relationships: [
          {
            foreignKeyName: "usage_counters_feature_key_fkey"
            columns: ["feature_key"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "usage_counters_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _current_subscription: {
        Args: { _school_id: string }
        Returns: {
          cancel_at_period_end: boolean
          cancelled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          grace_ends_at: string | null
          id: string
          interval: Database["public"]["Enums"]["billing_interval"] | null
          pending_plan_id: string | null
          pending_plan_price_id: string | null
          plan_id: string
          plan_price_id: string | null
          provider: string | null
          provider_subscription_ref: string | null
          school_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "subscriptions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      apply_verified_payment: {
        Args: {
          _amount_minor: number
          _currency: string
          _payload?: Json
          _provider: string
          _reference: string
        }
        Returns: Json
      }
      cancel_subscription: {
        Args: { _immediately?: boolean; _school_id: string }
        Returns: undefined
      }
      create_checkout_invoice: {
        Args: {
          _interval: Database["public"]["Enums"]["billing_interval"]
          _plan_code: string
          _school_id: string
        }
        Returns: string
      }
      get_entitlement: {
        Args: { _key: string; _school_id: string }
        Returns: {
          enabled: boolean
          is_unlimited: boolean
          limit_value: number
        }[]
      }
      get_platform_metrics: { Args: never; Returns: Json }
      has_feature: {
        Args: { _key: string; _school_id: string }
        Returns: boolean
      }
      has_school_role: {
        Args: {
          _roles: Database["public"]["Enums"]["school_role"][]
          _school_id: string
        }
        Returns: boolean
      }
      is_platform_admin: { Args: never; Returns: boolean }
      is_school_member: { Args: { _school_id: string }; Returns: boolean }
      log_subscription_event: {
        Args: {
          _from_plan?: string
          _from_status?: Database["public"]["Enums"]["subscription_status"]
          _meta?: Json
          _school_id: string
          _subscription_id: string
          _to_plan?: string
          _to_status?: Database["public"]["Enums"]["subscription_status"]
          _type: string
        }
        Returns: undefined
      }
      record_failed_payment: {
        Args: { _provider: string; _reason?: string; _reference: string }
        Returns: undefined
      }
      register_school: {
        Args: {
          _contact_email: string
          _contact_phone: string
          _country: string
          _interval: Database["public"]["Enums"]["billing_interval"]
          _name: string
          _plan_code: string
          _slug: string
          _start_trial?: boolean
        }
        Returns: string
      }
      resume_subscription: { Args: { _school_id: string }; Returns: undefined }
      run_subscription_lifecycle: { Args: never; Returns: Json }
      school_access_mode: { Args: { _school_id: string }; Returns: string }
      school_can_write: { Args: { _school_id: string }; Returns: boolean }
      within_limit: {
        Args: { _key: string; _proposed: number; _school_id: string }
        Returns: boolean
      }
    }
    Enums: {
      billing_interval: "monthly" | "annual"
      feature_kind: "boolean" | "limit" | "quota"
      invoice_status: "draft" | "open" | "paid" | "void" | "uncollectible"
      member_status: "active" | "invited" | "disabled"
      payment_status: "pending" | "succeeded" | "failed" | "refunded"
      school_role:
        | "school_admin"
        | "principal"
        | "registrar"
        | "accountant"
        | "teacher"
        | "staff"
      school_status: "pending_verification" | "active" | "suspended" | "closed"
      subscription_status:
        | "pending_payment"
        | "trialing"
        | "active"
        | "past_due"
        | "expired"
        | "cancelled"
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
      billing_interval: ["monthly", "annual"],
      feature_kind: ["boolean", "limit", "quota"],
      invoice_status: ["draft", "open", "paid", "void", "uncollectible"],
      member_status: ["active", "invited", "disabled"],
      payment_status: ["pending", "succeeded", "failed", "refunded"],
      school_role: [
        "school_admin",
        "principal",
        "registrar",
        "accountant",
        "teacher",
        "staff",
      ],
      school_status: ["pending_verification", "active", "suspended", "closed"],
      subscription_status: [
        "pending_payment",
        "trialing",
        "active",
        "past_due",
        "expired",
        "cancelled",
      ],
    },
  },
} as const
