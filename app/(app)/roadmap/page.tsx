import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";

const badgeMap: Record<string, [string, string]> = {
  completed: ["bg-cyan/15 text-cyan", "Done"],
  mastered: ["bg-cyan/15 text-cyan", "Mastered"],
  in_progress: ["bg-indig/15 text-indig", "In Progress"],
  revision_needed: ["bg-amber/15 text-amber", "Revise"],
  not_started: ["bg-glass text-ink-faint border border-glass-brd", "Start"],
};

export default async function RoadmapPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: subjects }, { data: topics }, { data: progress }] = await Promise.all([
    supabase.from("subjects").select("*").order("sort_order"),
    supabase.from("topics").select("id, slug, name, subject_id, group_name, sort_order").order("sort_order"),
    supabase.from("progress").select("topic_id, status").eq("user_id", user!.id),
  ]);

  const progressMap = new Map((progress ?? []).map((p) => [p.topic_id, p.status]));

  return (
    <div className="grid grid-cols-[250px_1fr] min-h-screen">
      <Sidebar />
      <main className="p-8 max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-display font-bold mb-1">Roadmap</h1>
        <p className="text-sm text-ink-dim mb-8">Click any topic to open it.</p>

        {(subjects ?? []).map((subject) => {
          const subjectTopics = (topics ?? []).filter((t) => t.subject_id === subject.id);
          if (subjectTopics.length === 0) return null;
          const doneCount = subjectTopics.filter((t) => {
            const s = progressMap.get(t.id);
            return s === "completed" || s === "mastered";
          }).length;

          return (
            <div key={subject.id} id={subject.slug} className="mb-9">
              <div className="flex items-center gap-2.5 mb-4">
                <h3 className="text-[15px] font-bold">{subject.icon} {subject.name}</h3>
                <span className="text-[11px] font-mono text-ink-faint">{doneCount}/{subjectTopics.length} done</span>
              </div>
              <div className="relative pl-6 before:content-[''] before:absolute before:left-[9px] before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-gradient-to-b before:from-indig before:to-vio">
                {subjectTopics.map((topic) => {
                  const status = progressMap.get(topic.id) ?? "not_started";
                  const [badgeCls, label] = badgeMap[status];
                  return (
                    <a
                      key={topic.id}
                      href={`/topic/${topic.slug}`}
                      className="relative block py-2 pl-5 -ml-5 rounded-[10px] hover:bg-glass transition"
                    >
                      <div className="flex items-center justify-between px-3.5 py-2">
                        <span className={`text-sm font-medium ${status === "completed" ? "text-ink-dim line-through" : ""}`}>
                          {topic.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${badgeCls}`}>
                          {label}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
