
'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const redirectTo = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo }
    });
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white/5 p-6 border border-white/10">
        <h1 className="text-xl font-semibold text-white mb-4">Sign in</h1>
        <label className="block text-sm text-white/90 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-transparent border-b border-white/70 p-2 text-sm text-white focus:outline-none focus:border-[var(--gold)]"
        />
        <button type="submit" className="mt-4 bg-[var(--gold)] text-black font-semibold px-4 py-2 text-sm">Send magic link</button>
        {sent && <p className="text-sm text-white/90 mt-3">Check your inbox for a login link.</p>}
        {error && <p className="text-sm text-red-300 mt-3">{error}</p>}
      </form>
    </div>
  );
}
