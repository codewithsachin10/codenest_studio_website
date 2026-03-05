import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
    return Boolean(supabaseUrl && supabaseAnonKey);
};

// Only create client if configured - prevents crash in demo mode
let supabaseClient: SupabaseClient<Database> | null = null;

if (isSupabaseConfigured()) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient as SupabaseClient<Database>;

// Safe getter that checks if client exists
export const getSupabase = () => {
    if (!supabaseClient) {
        console.warn('Supabase is not configured. Running in demo mode.');
        return null;
    }
    return supabaseClient;
};
