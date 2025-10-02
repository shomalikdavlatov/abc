import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Item = {
  id: number;
  title: string;
  description: string;
  test_options: string[];
  image: string;
  created_at: string;
  updated_at: string;
};
