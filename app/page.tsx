import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Root route just forwards to the right place — middleware handles the
// actual auth gate, this covers the "/" case specifically.
export default async function RootPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  redirect(user ? "/dashboard" : "/login");
}
