export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      business_cards: {
        Row: {
          id: string
          user_id: string
          title: string
          first_name: string
          last_name: string
          job_title: string
          company: string
          email: string
          phone: string
          website: string
          bio: string
          street: string
          city: string
          state: string
          zip_code: string
          country: string
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          first_name?: string
          last_name?: string
          job_title?: string
          company?: string
          email?: string
          phone?: string
          website?: string
          bio?: string
          street?: string
          city?: string
          state?: string
          zip_code?: string
          country?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          first_name?: string
          last_name?: string
          job_title?: string
          company?: string
          email?: string
          phone?: string
          website?: string
          bio?: string
          street?: string
          city?: string
          state?: string
          zip_code?: string
          country?: string
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      social_accounts: {
        Row: {
          id: string
          business_card_id: string
          platform: string
          username: string
          profile_url: string
          is_valid: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          business_card_id: string
          platform: string
          username: string
          profile_url: string
          is_valid?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          business_card_id?: string
          platform?: string
          username?: string
          profile_url?: string
          is_valid?: boolean
          display_order?: number
          created_at?: string
        }
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
  }
}