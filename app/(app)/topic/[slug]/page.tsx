import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import TopicBody from "./TopicBody";
import { notFound } from "next/navigation";

export default async function TopicPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: topic } = await supabase
    .from("topics")
    .select("*, subjects(name, slug)")
    .eq("slug", params.slug)
    .single();

  if (!topic) notFound();

  const [{ data: questions }, { data: progress }, { data: note }] = await Promise.all([
    supabase.from("questions").select("*").eq("topic_id", topic.id),
    supabase.from("progress").select("*").eq("user_id", user!.id).eq("topic_id", topic.id).maybeSingle(),
    supabase.from("notes").select("*").eq("user_id", user!.id).eq("topic_id", topic.id).maybeSingle(),
  ]);

  return (
    <div className="grid grid-cols-[250px_1fr] min-h-screen">
      <Sidebar />
      <main className="p-8 max-w-4xl mx-auto w-full">
        <TopicBody
          topic={topic}
          questions={questions ?? []}
          initialStatus={progress?.status ?? "not_started"}
          initialNote={note?.content ?? ""}
          userId={user!.id}
        />
      </main>
    </div>
  );
}
