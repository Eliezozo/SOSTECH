"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError("Identifiants incorrects. Vérifie ton email et ton mot de passe.");
      setLoading(false);
    }
    // On success, AdminApp's auth listener swaps to the dashboard.
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-white/10 bg-ink-card p-8 shadow-md"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Image src="/logo.png" alt="Sostech Systems" width={150} height={54} className="h-12 w-auto" />
          <h1 className="mt-4 text-xl">Espace administrateur</h1>
          <p className="mt-1 text-sm text-content-muted">Connecte-toi pour gérer le contenu du site.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-ink-alt/60 px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-ink-alt/60 px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        {error && (
          <p className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
