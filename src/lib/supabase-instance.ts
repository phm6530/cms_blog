import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export class SupabaseStorage {
  private static instance: SupabaseClient;

  static getInstance(): SupabaseClient {
    if (SupabaseStorage.instance) {
      return this.instance;
    } else {
      this.instance = createClient(supabaseUrl, supabaseKey);
      return this.instance;
    }
  }
}
