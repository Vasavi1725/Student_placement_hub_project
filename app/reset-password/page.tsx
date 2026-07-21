"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (!error) {
      setDone(true);
      setTimeout(() => router.push("/login"), 1500);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="glass-card w-full max-w-sm p-9">
        <h1 className="text-xl font-bold font-display mb-4">Set a new password</h1>
        {done ? (
          <p className="text-sm text-cyan">Password updated — redirecting to login…</p>
        ) : (
          <form onSubmit={handleReset} className="space-y-3.5">
            <input
              type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full bg-bg-elev border border-glass-brd rounded-[10px] px-3.5 py-2.5 text-sm outline-none"
            />
            <button type="submit" className="w-full bg-grad-brand text-white text-sm font-semibold rounded-[11px] py-2.5">
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
