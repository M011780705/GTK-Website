import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${url.origin}/login`);
  }

  // IMPORTANT: use anon key here (not service role)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Exchange OAuth code for session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session || !data.user) {
    console.log("AUTH ERROR:", error);
    return NextResponse.redirect(`${url.origin}/login`);
  }

  const user = data.user;

  // Ensure username fallback from Discord metadata
  const username =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.preferred_username ||
    "Discord User";

  // Create profile (safe upsert)
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        username,
        is_admin: false,
      },
      {
        onConflict: "id",
      }
    );

  if (profileError) {
    console.log("PROFILE ERROR:", profileError);
  }

  // Go home
  return NextResponse.redirect(`${url.origin}/`);
}