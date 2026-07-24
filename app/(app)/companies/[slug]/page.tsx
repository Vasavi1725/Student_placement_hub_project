import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import { notFound } from "next/navigation";

type Section = { name: string; questions: number; minutes: number; difficulty: string };

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createClient();
  const [{ data: company }, { data: allCompanies }] = await Promise.all([
    supabase.from("companies").select("*").eq("slug", slug).single(),
    supabase.from("companies").select("slug, name"),
  ]);

  if (!company) notFound();

  return (
    <div className="grid grid-cols-[250px_1fr] min-h-screen">
      <Sidebar />
      <main className="p-8 max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-display font-bold mb-1">Company-wise Preparation</h1>
        <p className="text-sm text-ink-dim mb-6">Written test patterns and focused strategy.</p>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {(allCompanies ?? []).map((c) => (
            <a key={c.slug} href={`/companies/${c.slug}`} className={`glass-card p-4 text-center block ${c.slug === slug ? "border-vio" : ""}`}>
              <div className="w-11 h-11 rounded-xl bg-grad-brand mx-auto mb-2.5 flex items-center justify-center font-display font-bold text-white text-sm">
                {c.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-[12.5px] font-semibold">{c.name}</div>
            </a>
          ))}
        </div>

        <h2 className="text-base font-semibold mb-3">{company.name} — Written Test Pattern</h2>
        <div className="glass-card p-5 overflow-x-auto">
          <table className="w-full text-[12.5px] border-collapse">
            <thead>
              <tr className="text-left text-ink-faint text-[11px] uppercase">
                <th className="py-2.5 border-b border-glass-brd">Section</th>
                <th className="py-2.5 border-b border-glass-brd">Questions</th>
                <th className="py-2.5 border-b border-glass-brd">Time</th>
                <th className="py-2.5 border-b border-glass-brd">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {(company.sections as Section[]).map((s, i) => (
                <tr key={i}>
                  <td className="py-3 border-b border-glass-brd">{s.name}</td>
                  <td className="py-3 border-b border-glass-brd">{s.questions}</td>
                  <td className="py-3 border-b border-glass-brd">{s.minutes} min</td>
                  <td className="py-3 border-b border-glass-brd capitalize">{s.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className="text-[13px] font-semibold mt-5 mb-2">Frequently Asked Topics</h4>
          <div className="flex gap-2 flex-wrap">
            {(company.focus_topics as string[]).map((t: string, i: number) => (
              <span key={i} className="text-[11px] border border-glass-brd rounded-full px-3 py-1">{t}</span>
            ))}
          </div>

          <h4 className="text-[13px] font-semibold mt-5 mb-2">Preparation Strategy</h4>
          <p className="text-sm text-ink-dim leading-7">{company.strategy}</p>
        </div>
      </main>
    </div>
  );
}
