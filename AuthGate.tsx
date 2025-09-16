
'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

async function checkAllowlist(email: string | null): Promise<boolean> {
  if (!email) return false;
  const envAllow = process.env.NEXT_PUBLIC_ALLOWLIST?.toLowerCase() || '';
  if (envAllow) {
    const list = envAllow.split(',').map(s => s.trim());
    if (list.includes(email.toLowerCase())) return true;
  }
  try {
    const { data, error } = await supabase
      .from('whitelist_emails')
      .select('email')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    if (error) return false;
    return !!data;
  } catch { return false; }
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'checking'|'allowed'|'blocked'|'anon'>('checking');

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) { setStatus('anon'); return; }
      const ok = await checkAllowlist(user.email);
      setStatus(ok ? 'allowed' : 'blocked');
    };
    run();
  }, []);

  if (status === 'checking') return <div className="p-6 text-white">Loading…</div>;
  if (status === 'anon') return <div className="p-6 text-white">Please sign in first.</div>;
  if (status === 'blocked') return <div className="p-6 text-white">This account isn’t invited.</div>;
  return <>{children}</>;
}
