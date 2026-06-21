import { createSupabaseServer } from "@/lib/supabaseServer";

export async function isAdmin(email: string) {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("admins")
    .select("email")
    .eq("email", email)
    .single();

  if (error || !data) return false;

  return true;
}