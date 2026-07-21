"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type Topic = {
  id: string; name: string; overview: string | null;
  formulas: { label: string; formula: string }[];
  tricks: string[]; common_mistakes: string[];
  solved_examples: { question: string; solution: string }[];
  video_resources: { title: string; source: string; url: string }[];
  reference_links: { name: string; url: string }[];
  subjects: { name: string; slug: string } | null;
};
type Question = { id: string; question_text: string; difficulty: string; external_url: string | null };

const tabs = ["Overview", "Formulas & Tricks", "Solved Examples", "Practice", "Videos & References", "My Notes"];

export default function TopicBody({
  topic, questions, initialStatus, initialNote, userId,
}: { topic: Topic; questions: Question[]; initialStatus: string; initialNote: string; userId: string }) {
  const supabase = createClient();
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState(initialStatus);
  const [note, setNote] = useState(initialNote);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  async function updateStatus(newStatus: string) {
    setStatus(newStatus);
    await supabase.from("progress").upsert(
      { user_id: userId, topic_id: topic.id, status: newStatus, completed_at: newStatus === "completed" ? new Date().toISOString() : null },
      { onConflict: "user_id,topic_id" }
    );
  }

  useEffect(() => {
    if (note === initialNote) return;
    setSaveState("saving");
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await supabase.from("notes").upsert(
        { user_id: userId, topic_id: topic.id, content: note, updated_at: new Date().toISOString() },
        { onConflict: "user_id,topic_id" }
      );
      setSaveState("saved");
    }, 900);
    return () => clearTimeout(debounceRef.current);
  }, [note]); // eslint-disable-line react-hooks/exhaustive-deps

  const diffPill = (d: string) =>
    d === "easy" ? "bg-cyan/15 text-cyan" : d === "medium" ? "bg-amber/15 text-amber" : "bg-rose/15 text-rose";

  return (
    <>
      <div className="glass-card p-7 mb-6">
        <div className="text-[11.5px] text-ink-faint mb-2.5">
          <b className="text-indig">{topic.subjects?.name}</b> / {topic.name}
        </div>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-display font-bold">{topic.name}</h1>
          <select
            value={status}
            onChange={(e) => updateStatus(e.target.value)}
            className="bg-bg-elev border border-glass-brd rounded-full text-xs font-semibold px-3 py-1.5"
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="revision_needed">Revision Needed</option>
            <option value="mastered">Mastered</option>
          </select>
        </div>
        <p className="text-sm text-ink-dim mt-2 max-w-xl">{topic.overview}</p>
      </div>

      <div className="flex gap-1 border-b border-glass-brd mb-6 overflow-x-auto">
        {tabs.map((t, i) => (
          <button
            key={t} onClick={() => setActive(i)}
            className={`px-4 py-2.5 text-[12.5px] font-semibold whitespace-nowrap border-b-2 ${
              active === i ? "border-indig text-ink" : "border-transparent text-ink-dim"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {active === 0 && (
        <div className="glass-card p-6">
          <p className="text-sm text-ink-dim leading-7">{topic.overview}</p>
        </div>
      )}

      {active === 1 && (
        <div className="glass-card p-6">
          <h4 className="text-sm font-semibold mb-2">Formulas</h4>
          {topic.formulas?.map((f, i) => (
            <div key={i} className="bg-bg-elev border border-glass-brd rounded-xl px-4 py-3 my-2 font-mono text-[13.5px] text-cyan">
              {f.label}: {f.formula}
            </div>
          ))}
          <h4 className="text-sm font-semibold mt-5 mb-2">Tricks</h4>
          {topic.tricks?.map((t, i) => (
            <div key={i} className="flex gap-2.5 py-2 border-b border-dashed border-glass-brd text-sm text-ink-dim">
              <span className="font-mono font-bold text-vio">{String(i + 1).padStart(2, "0")}</span>{t}
            </div>
          ))}
          <h4 className="text-sm font-semibold mt-5 mb-2">Common Mistakes</h4>
          {topic.common_mistakes?.map((m, i) => (
            <div key={i} className="flex gap-2.5 py-2 border-b border-dashed border-glass-brd text-sm text-ink-dim">
              <span className="font-mono font-bold text-rose">✕</span>{m}
            </div>
          ))}
        </div>
      )}

      {active === 2 && (
        <div className="glass-card p-6 space-y-3">
          {topic.solved_examples?.map((ex, i) => (
            <div key={i} className="bg-bg-elev border border-glass-brd rounded-xl p-4">
              <div className="font-semibold text-sm mb-2">Q{i + 1}. {ex.question}</div>
              <div className="text-sm text-ink-dim leading-7">{ex.solution}</div>
            </div>
          ))}
        </div>
      )}

      {active === 3 && (
        <div className="glass-card p-5 space-y-2.5">
          {questions.length === 0 && <p className="text-sm text-ink-faint">No practice questions seeded for this topic yet.</p>}
          {questions.map((q) => (
            <div key={q.id} className="glass-card p-4 flex items-center justify-between gap-3">
              <span className="text-sm font-medium flex-1">{q.question_text}</span>
              {q.external_url ? (
                <a href={q.external_url} target="_blank" className="text-[11px] text-indig font-semibold whitespace-nowrap">Solve on IndiaBIX →</a>
              ) : (
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${diffPill(q.difficulty)}`}>{q.difficulty}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {active === 4 && (
        <div>
          <h4 className="text-[13px] text-ink-dim mb-2.5">Explanation Videos</h4>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {topic.video_resources?.map((v, i) => (
              <a key={i} href={v.url} target="_blank" className="glass-card block overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-[#1a1f3a] to-[#2a1f4a] flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-grad-brand flex items-center justify-center text-white">▶</div>
                </div>
                <div className="p-3">
                  <div className="text-[12.5px] font-semibold">{v.title}</div>
                  <div className="text-[11px] text-ink-faint">{v.source}</div>
                </div>
              </a>
            ))}
          </div>
          <h4 className="text-[13px] text-ink-dim mb-2.5">Reference Reading</h4>
          <div className="grid grid-cols-3 gap-3">
            {topic.reference_links?.map((r, i) => (
              <a key={i} href={r.url} target="_blank" className="glass-card p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-[9px] bg-glass flex items-center justify-center text-xs font-bold">
                  {r.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-[12.5px] font-semibold">{r.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {active === 5 && (
        <div className="glass-card p-5">
          <h4 className="text-[13px] font-semibold mb-2.5">Personal Notes <span className="text-ink-faint font-normal">· Markdown supported</span></h4>
          <textarea
            value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="Jot your own shortcuts and reminders here…"
            className="w-full min-h-[160px] bg-bg-elev border border-glass-brd rounded-xl p-3.5 text-sm outline-none focus:border-indig"
          />
          <div className="text-[10.5px] text-ink-faint mt-1.5">
            {saveState === "saving" ? "Saving…" : saveState === "saved" ? "✓ Saved" : "Auto-saves as you type"}
          </div>
        </div>
      )}
    </>
  );
}
