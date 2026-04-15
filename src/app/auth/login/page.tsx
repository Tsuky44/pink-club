"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const DISCORD_SVG = (
  <svg width="20" height="20" viewBox="0 0 71 55" fill="currentColor">
    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39893 45.468 0.440969 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.401552 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9143 10.8048 4.9426 10.7825 4.9797C1.5779 18.7309 -0.943537 32.1443 0.293158 45.3934C0.299005 45.4565 0.335387 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3634 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9292 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2817 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2789 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9292 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.4596 70.6946 45.3964C72.1747 30.0791 68.2147 16.7757 60.1968 4.9826C60.1772 4.9429 60.1437 4.9146 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7637 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
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

  // Force login tab when registration is disabled
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_FEATURE_REGISTRATION !== "true") {
      setTab("login");
    }
  }, []);

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
          {process.env.NEXT_PUBLIC_FEATURE_REGISTRATION === "true" ? (
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
          ) : (
            <div className="mb-6 pb-4 border-b border-surface-variant">
              <h2 className="font-[family-name:var(--font-space-grotesk)] font-black uppercase tracking-widest text-white text-sm">
                CONNEXION ADMIN
              </h2>
              <p className="text-on-surface-variant text-xs mt-1">
                Les inscriptions membres seront bientôt disponibles.
              </p>
            </div>
          )}

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
