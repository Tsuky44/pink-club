"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const DISCORD_SVG = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.01.043.021.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
  </svg>
);

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/wall-of-fame";

  const [tab, setTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass = "w-full bg-surface-variant border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors";
  const labelClass = "block text-xs uppercase tracking-widest text-on-surface-variant mb-2";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", { login: username, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      setError("Pseudo ou mot de passe incorrect.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    let res: Response;
    let data: { error?: string; success?: boolean } = {};
    try {
      res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      data = await res.json();
    } catch {
      setError("Erreur serveur. Réessaie dans un instant.");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setError(data.error ?? "Erreur lors de la création du compte.");
      setLoading(false);
      return;
    }

    // Auto-login after register
    const result = await signIn("credentials", { login: username, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      setSuccess("Compte créé ! Tu peux maintenant te connecter.");
      setTab("login");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleDiscord = () => {
    signIn("discord", { callbackUrl });
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-surface-container border border-surface-variant p-8">
          {/* Tabs */}
          <div className="flex mb-8 border-b border-surface-variant">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                className={`flex-1 pb-3 font-[family-name:var(--font-space-grotesk)] font-black uppercase tracking-widest text-xs transition-colors ${
                  tab === t
                    ? "border-b-2 border-primary text-white -mb-[1px]"
                    : "text-on-surface-variant hover:text-white"
                }`}
              >
                {t === "login" ? "CONNEXION" : "CRÉER UN COMPTE"}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              {success}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4 mb-6">
              <div>
                <label className={labelClass}>Pseudo</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} placeholder="TonPseudo" required autoComplete="username" />
              </div>
              <div>
                <label className={labelClass}>Mot de passe</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" required />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white font-[family-name:var(--font-space-grotesk)] font-black uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                {loading ? "CONNEXION..." : "SE CONNECTER"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 mb-6">
              <div>
                <label className={labelClass}>Pseudo</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} placeholder="TonPseudo" required minLength={3} autoComplete="username" />
              </div>
              <div>
                <label className={labelClass}>Mot de passe</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="6 caractères min." required minLength={6} />
              </div>
              <div>
                <label className={labelClass}>Confirmer le mot de passe</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} placeholder="••••••••" required />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white font-[family-name:var(--font-space-grotesk)] font-black uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                {loading ? "CRÉATION..." : "REJOINDRE L'ÉQUIPE"}
              </button>
            </form>
          )}

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest text-on-surface-variant">
              <span className="bg-surface-container px-2">ou</span>
            </div>
          </div>

          <button
            onClick={handleDiscord}
            className="w-full py-3 bg-[#5865F2] text-white font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-widest text-sm hover:bg-[#4752C4] transition-colors flex items-center justify-center gap-3"
          >
            {DISCORD_SVG}
            CONTINUER AVEC DISCORD
          </button>

          <p className="mt-6 text-center text-xs text-on-surface-variant">
            <Link href="/" className="hover:text-white transition-colors">
              ← Retour au site
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
