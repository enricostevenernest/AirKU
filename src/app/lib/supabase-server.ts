// Supabase client untuk Server Component / Server Action
// Menggunakan anon key (INSERT diizinkan via RLS policy "Allow public insert")
//
// SCRUM-287: Client ini digunakan oleh Server Action (submitKritikSaran) untuk
// menerima data dari form dan melakukan insert ke tabel kritik_saran di Supabase.
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
