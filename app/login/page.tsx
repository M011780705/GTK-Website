async function login() {
  setMessage("Logging in...");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setMessage("Error: " + error.message);
    return;
  }

  if (!data.user) return;

  // CHECK PROFILE
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", data.user.id)
    .single();

  if (!profile) {
    router.push("/setup-username");
    return;
  }

  router.push("/");
}