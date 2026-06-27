import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${url.origin}/login`);
  }

  // 1. AUTH CLIENT (safe public anon key)
  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabaseAuth.auth.exchangeCodeForSession(code);

  if (error || !data?.user) {
    console.log("AUTH ERROR:", error);
    return NextResponse.redirect(`${url.origin}/login`);
  }

  const user = data.user;

  const metadata = user.user_metadata || {};

  const username =
    metadata.global_name ||
    metadata.full_name ||
    metadata.name ||
    metadata.preferred_username ||
    metadata.user_name ||
    "Discord User";

  console.log("USER:", user.id);
  console.log("USERNAME:", username);

  // 2. ADMIN CLIENT (THIS BYPASSES RLS)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: insertData, error: insertError } = await supabaseAdmin
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
    )
    .select();

  console.log("PROFILE INSERT RESULT:", insertData);
  console.log("PROFILE INSERT ERROR:", insertError);

  return NextResponse.redirect(`${url.origin}/`);
}