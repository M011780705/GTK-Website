import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Exchange OAuth code for session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.log("AUTH ERROR:", error);
    return NextResponse.redirect(`${origin}/login`);
  }

  const user = data.user;

  // 🔥 CRITICAL: CREATE PROFILE IF IT DOESN'T EXIST
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      username:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        "Discord User",
      is_admin: false,
    });

  if (profileError) {
    console.log("PROFILE ERROR:", profileError);
  }

  return NextResponse.redirect(`${origin}/`);
}