import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${url.origin}/login`);
  }

  // Server client (service role = REQUIRED for reliable inserts)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Exchange OAuth code for session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.user) {
    console.log("AUTH ERROR:", error);
    return NextResponse.redirect(`${url.origin}/login`);
  }

  const user = data.user;

  // ✅ FIXED: Reliable Discord username extraction
  const metadata = user.user_metadata || {};

  const username =
    metadata.full_name ||
    metadata.name ||
    metadata.global_name ||
    metadata.preferred_username ||
    metadata.user_name ||
    "Discord User";

  // Debug (safe to remove later)
  console.log("DISCORD METADATA:", metadata);
  console.log("FINAL USERNAME:", username);

  // Create / update profile
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

  return NextResponse.redirect(`${url.origin}/`);
}