"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setInfo("Account created — check your email to confirm before logging in.");
    }
  }

  async function handleGoogleSignup() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="glass-card w-full max-w-sm p-9">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-[10px] bg-grad-brand flex items-center justify-center font-display font-bold text-white">P</div>
          <div className="font-display font-semibold text-sm leading-tight">Placement<br />Aptitude Master</div>
        </div>
        <h1 className="text-xl font-bold font-display mb-1">Create your account</h1>
        <p className="text-sm text-ink-dim mb-6">Free — track progress across 400+ topics.</p>

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-ink-dim block mb-1.5">Full Name</label>
            <input
              type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
              placeholder="Ravi Kumar"
              className="w-full bg-bg-elev border border-glass-brd rounded-[10px] px-3.5 py-2.5 text-sm outline-none focus:border-indig"
            />
          </div>
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
              placeholder="At least 6 characters"
              className="w-full bg-bg-elev border border-glass-brd rounded-[10px] px-3.5 py-2.5 text-sm outline-none focus:border-indig"
            />
          </div>
          {error && <p className="text-xs text-rose">{error}</p>}
          {info && <p className="text-xs text-cyan">{info}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-grad-brand text-white text-sm font-semibold rounded-[11px] py-2.5 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <div className="flex items-center gap-2.5 my-4 text-ink-faint text-[11px]">
          <span className="flex-1 h-px bg-glass-brd" /> OR <span className="flex-1 h-px bg-glass-brd" />
        </div>
        <button
          onClick={handleGoogleSignup}
          className="w-full border border-glass-brd rounded-[11px] py-2.5 text-sm font-medium flex items-center justify-center gap-2"
        >
          Sign up with Google
        </button>

        <p className="text-center text-sm text-ink-dim mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-indig font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
}
