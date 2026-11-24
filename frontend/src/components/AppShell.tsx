'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Brain,
  Cpu,
  LayoutDashboard,
  Menu,
  PenTool,
  Settings,
  TrendingUp,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/content', label: 'Content Studio', icon: PenTool },
  { href: '/memory', label: 'Brand Memory', icon: Brain },
  { href: '/analytics', label: 'Analytics', icon: TrendingUp },
  { href: '/traces', label: 'Agent Traces', icon: Cpu },
  { href: '/settings', label: 'Settings', icon: Settings },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const sidebar = (
    <div className="flex h-full flex-col justify-between p-6">
      <div>
        <div className="mb-10 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-2xl font-bold tracking-tight text-white">
              Viralytiq
            </Link>
            <p className="mt-1 text-sm text-slate-400">AI Content Strategist</p>
          </div>
          <button
            type="button"
            className="md:hidden rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-1.5" aria-label="Main">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  active
                    ? 'border border-indigo-500/25 bg-indigo-500/20 text-white'
                    : 'border border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-100'
                )}
              >
                <Icon size={18} className={active ? 'text-indigo-300' : undefined} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 pt-4 text-xs text-slate-500">
        FastAPI · LangGraph · Groq · pgvector
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#050816] text-white">
      <aside className="glass-sidebar hidden w-72 shrink-0 md:flex md:flex-col">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="glass-sidebar relative z-10 h-full w-72">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-white/10 bg-[#050816]/90 px-4 backdrop-blur-md md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <span className="font-semibold text-white">Viralytiq</span>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}