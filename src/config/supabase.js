import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const isDemoMode = !isSupabaseConfigured;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export const STORAGE_BUCKETS = {
  resumes: "resumes",
  videos: "videos"
};

export const DEMO_MODE_MESSAGE = "Demo Mode - Data is not persisted";

export const withSupabaseFallback = async (supabaseTask, demoTask) => {
  if (isDemoMode || !supabase) {
    return demoTask();
  }

  try {
    return await supabaseTask();
  } catch (error) {
    console.warn("Supabase call failed, falling back to demo mode.", error);
    return demoTask();
  }
};
