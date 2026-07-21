"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email above first, then click 'Forgot password'.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });
    setError(error ? error.message : "Password reset email sent — check your inbox.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="glass-card w-full max-w-sm p-9">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-[10px] bg-grad-brand flex items-center justify-center font-display font-bold text-white">P</div>
          <div className="font-display font-semibold text-sm leading-tight">Placement<br />Aptitude Master</div>
        </div>
        <h1 className="text-xl font-bold font-display mb-1">Welcome back</h1>
        <p className="text-sm text-ink-dim mb-6">Log in to pick up where you left off.</p>

        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-ink-dim block mb-1.5">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
              className="w-full bg-bg-elev border border-glass-brd rounded-[10px] px-3.5 py-2.5 text-sm outline-none focus:border-indig"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-dim block mb-1.5">Password</label>
            <input
              type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-bg-elev border border-glass-brd rounded-[10px] px-3.5 py-2.5 text-sm outline-none focus:border-indig"
            />
          </div>
          <button type="button" onClick={handleForgotPassword} className="text-xs text-indig block ml-auto -mt-1">
            Forgot password?
          </button>
          {error && <p className="text-xs text-rose">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-grad-brand text-white text-sm font-semibold rounded-[11px] py-2.5 disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>

        <div className="flex items-center gap-2.5 my-4 text-ink-faint text-[11px]">
          <span className="flex-1 h-px bg-glass-brd" /> OR <span className="flex-1 h-px bg-glass-brd" />
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full border border-glass-brd rounded-[11px] py-2.5 text-sm font-medium flex items-center justify-center gap-2"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-ink-dim mt-5">
          New here?{" "}
          <Link href="/register" className="text-indig font-semibold">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
