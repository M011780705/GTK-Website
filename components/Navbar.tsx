"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();

    const user = data?.user ?? null;

    setUser(user);

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const { data: admin } = await supabase
      .from("admins")
      .select("email")
      .eq("email", user.email)
      .maybeSingle();

    setIsAdmin(!!admin);
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <nav style={nav}>
      <div style={left}>
        <Link href="/" style={logo}>
          GTK Home
        </Link>
      </div>

      <div style={links}>
        <Link href="/list" style={link}>
          Main List
        </Link>

        <Link href="/legacy" style={link}>
          Legacy List
        </Link>

        <Link href="/submit" style={link}>
          Submit Run
        </Link>

        <Link href="/players" style={link}>
          Leaderboard
        </Link>

        <Link href="/rules" style={link}>
          Rules
        </Link>

        {/* NOT LOGGED IN */}
        {!loading && !user && (
          <Link href="/login" style={discordButton}>
            Login with Discord
          </Link>
        )}

        {/* LOGGED IN */}
        {!loading && user && (
          <>
            <Link href="/profile" style={link}>
              Profile
            </Link>

            {isAdmin && (
              <Link href="/admin" style={link}>
                Admin
              </Link>
            )}

            <button onClick={logout} style={logoutButton}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const nav: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 25px",
  background: "#111",
  borderBottom: "1px solid #333",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const left: React.CSSProperties = {
  fontWeight: "bold",
};

const logo: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  fontSize: 18,
};

const links: React.CSSProperties = {
  display: "flex",
  gap: 15,
  alignItems: "center",
  flexWrap: "wrap",
};

const link: React.CSSProperties = {
  color: "#ccc",
  textDecoration: "none",
};

const discordButton: React.CSSProperties = {
  background: "#5865F2",
  color: "white",
  padding: "6px 10px",
  borderRadius: 6,
  textDecoration: "none",
};

const logoutButton: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#ccc",
  cursor: "pointer",
  fontSize: "1rem",
  padding: 0,
};