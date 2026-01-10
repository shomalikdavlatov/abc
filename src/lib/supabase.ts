import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ColorCategory = 'RED' | 'BLUE' | 'GREEN';

export type Item = {
  id: number;
  title: string;
  description: string;
  example: string;
  test_title: string;
  color: string;
  is_colorable: boolean;
  color_category: ColorCategory;
  test_options: string[] | null;
  image: string;
  created_at: string;
  updated_at: string;
};