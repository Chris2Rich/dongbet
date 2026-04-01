import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type User = {
  code: string;
  firstname: string;
  lastname: string;
  formgroup: string;
  points: number;
  predictions: any[];
  created_at: string;
  updated_at: string;
};

export type Match = {
  id: string;
  data: any;
  created_at: string;
  updated_at: string;
};
