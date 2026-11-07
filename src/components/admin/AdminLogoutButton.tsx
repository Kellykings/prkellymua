'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, RefreshCw } from 'lucide-react';

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-mono font-semibold rounded-sm transition-colors disabled:opacity-50"
      title="Lock Console / Sign Out"
    >
      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
      <span>Lock</span>
    </button>
  );
}
