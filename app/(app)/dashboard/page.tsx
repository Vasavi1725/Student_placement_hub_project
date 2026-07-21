import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import ProgressRing from "@/components/ProgressRing";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Pull everything the dashboard needs in parallel.
  const [{ data: profile }, { data: subjects }, { data: progress }, { count: totalTopics }] =
    await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user!.id).single(),
      supabase.from("subjects").select("id, slug, name, icon, color"),
      supabase.from("progress").select("status, topic_id").eq("user_id", user!.id),
      supabase.from("topics").select("id", { count: "exact", head: true }),
    ]);

  const completed = (progress ?? []).filter(
    (p) => p.status === "completed" || p.status === "mastered"
  ).length;
  const total = totalTopics ?? 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-[250px_1fr] min-h-screen">
      <Sidebar />
      <main className="p-8 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-display font-bold mb-1">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <p className="text-sm text-ink-dim mb-7">Here's where your prep stands today.</p>

        <div className="grid grid-cols-[2fr_1fr] gap-4 mb-8">
          <div className="glass-card p-6 flex items-center gap-6">
            <ProgressRing pct={pct} />
            <div>
              <div className="font-mono text-2xl font-bold">{completed} / {total}</div>
              <div className="text-xs text-ink-dim mt-1">Topics completed</div>
              <a href="/roadmap" className="inline-block mt-4 bg-grad-brand text-white text-sm font-semibold rounded-[11px] px-5 py-2.5">
                Continue Learning →
              </a>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="text-xs font-semibold text-ink-dim mb-2">Your Subjects</div>
            <div className="text-3xl font-mono font-bold">{subjects?.length ?? 0}</div>
            <div className="text-xs text-ink-faint mt-1">tracked subject areas</div>
          </div>
        </div>

        <h2 className="text-base font-semibold mb-3">Subjects</h2>
        <div className="grid grid-cols-3 gap-3">
          {(subjects ?? []).map((s) => (
            <a key={s.id} href={`/roadmap#${s.slug}`} className="glass-card p-4 hover:-translate-y-0.5 transition block">
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center text-lg mb-2"
                style={{ background: `rgba(${s.color},0.15)` }}
              >
                {s.icon}
              </div>
              <div className="text-sm font-semibold">{s.name}</div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
