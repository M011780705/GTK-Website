import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 🔥 THIS HANDLES BOTH access_token + code flows automatically
  const { data, error } = await supabase.auth.getSessionFromUrl({
    url: request.url,
  });

  if (error || !data.session) {
    console.log("AUTH FAILED:", error);
    return NextResponse.redirect(`${url.origin}/login`);
  }

  const user = data.session.user;

  const username =
    user.user_metadata?.global_name ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Discord User";

  // IMPORTANT: DO NOT BLOCK LOGIN IF PROFILE FAILS
  await supabase.from("profiles").upsert({
    id: user.id,
    username,
    is_admin: false,
  });

  return NextResponse.redirect(`${url.origin}/`);
}