import { createClient, SupabaseClient } from '@supabase/supabase-js';

type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          code: string;
          firstname: string;
          lastname: string;
          formgroup: string;
          points: number;
          predictions: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          code: string;
          firstname: string;
          lastname: string;
          formgroup: string;
          points?: number;
          predictions?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          code?: string;
          firstname?: string;
          lastname?: string;
          formgroup?: string;
          points?: number;
          predictions?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      matches: {
        Row: {
          id: string;
          data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          data: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          data?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

let supabaseInstance: SupabaseClient<Database> | null = null;

export function getSupabase() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
    }
    
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseKey);
  }
  return supabaseInstance;
}

export type User = Database['public']['Tables']['users']['Row'];
export type Match = Database['public']['Tables']['matches']['Row'];
