"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/companies/tcs", label: "Companies" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="border-r border-glass-brd p-6 sticky top-0 h-screen flex flex-col gap-1 overflow-y-auto">
      <div className="flex items-center gap-2.5 pb-5 px-2">
        <div className="w-8 h-8 rounded-[10px] bg-grad-brand flex items-center justify-center font-display font-bold text-white text-sm">P</div>
        <div className="font-display font-semibold text-sm leading-tight">
          Placement<br /><span className="text-[10px] text-ink-faint uppercase tracking-wide">Aptitude Master</span>
        </div>
      </div>
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-sm font-medium transition ${
            pathname.startsWith(item.href) ? "bg-glass text-ink" : "text-ink-dim hover:bg-glass hover:text-ink"
          }`}
        >
          {item.label}
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-sm font-medium text-ink-dim hover:bg-glass hover:text-rose text-left"
      >
        Log out
      </button>
    </aside>
  );
}
