"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";

export default function AdminApp() {
  const [configured] = useState(() => isSupabaseConfigured());
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, [configured]);

  if (!configured) return <SetupNotice />;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-gold" />
      </div>
    );
  }

  if (!session) return <LoginForm />;

  return <Dashboard email={session.user.email ?? ""} />;
}

function SetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-lg rounded-lg border border-white/10 border-l-4 border-l-gold bg-ink-card p-8">
        <h1 className="text-2xl text-gold">Configuration requise</h1>
        <p className="mt-4 text-sm leading-relaxed text-content-muted">
          Les variables Supabase ne sont pas renseignées. Ajoute dans ton fichier{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-gold-light">.env.local</code> :
        </p>
        <pre className="mt-4 overflow-x-auto rounded-md bg-ink p-4 text-xs text-content-muted">
{`NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...`}
        </pre>
        <p className="mt-4 text-sm text-content-muted">
          Puis relance <code className="rounded bg-white/10 px-1.5 py-0.5 text-gold-light">npm run dev</code>.
        </p>
      </div>
    </div>
  );
}
