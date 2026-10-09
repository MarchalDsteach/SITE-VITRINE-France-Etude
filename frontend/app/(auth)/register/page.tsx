'use client';

import { useState } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await auth.register(form);
      setSuccess(response.data.message);
      setForm({ email: '', password: '', firstName: '', lastName: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mesh-bg relative grid min-h-screen place-items-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(251,248,242,0.06)_1px,transparent_0)] bg-[size:26px_26px]" />
      <div className="relative w-full max-w-[560px]">
        <Link href="/" className="mb-6 inline-flex items-center gap-3 text-sm font-semibold text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 font-display text-lg text-red-2">G</span>
          <span>GPI <span className="font-normal text-white/60">Voyages</span></span>
        </Link>

        <section className="rounded-[18px] border border-white/50 bg-white p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,.6)] sm:p-8">
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-paper-2 p-1.5">
            <Link href="/login" className="rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-slate transition-colors hover:bg-white hover:text-ink">
              Se connecter
            </Link>
            <span aria-current="page" className="rounded-lg bg-ink px-3 py-2.5 text-center text-sm font-semibold text-white">
              Créer un compte
            </span>
          </div>

          <p className="kicker">Espace étudiant</p>
          <h1 className="mt-2 text-3xl font-semibold">Votre projet commence ici.</h1>
          <p className="mt-2 text-sm text-slate">
            Créez votre compte gratuitement. Votre accès sera activé après validation par l’équipe GPI.
          </p>

          {error && (
            <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="field">
                Prénom
                <input
                  type="text"
                  required
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="Votre prénom"
                />
              </label>
              <label className="field">
                Nom
                <input
                  type="text"
                  required
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Votre nom"
                />
              </label>
            </div>

            <label className="field">
              Email
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="votre@email.com"
              />
            </label>

            <label className="field">
              Mot de passe
              <input
                type="password"
                required
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Choisissez un mot de passe"
              />
            </label>

            <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Création...' : "Créer mon compte"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs leading-relaxed text-slate">
            En créant un compte, vous pourrez suivre vos demandes et retrouver vos informations dans votre espace étudiant.
          </p>
        </section>
      </div>
    </main>
  );
}
