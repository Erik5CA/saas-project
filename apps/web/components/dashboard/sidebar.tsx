'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layout, FolderKanban, LogOut, User as UserIcon, Settings, HelpCircle } from 'lucide-react';
import { TenantSelector } from './tenant-selector';
import { useAuthContext } from '@/contexts/auth-context';
import { cn } from '../ui';
import { useAuth } from '@/hooks/api/useAuth';

const navigation = [
  { name: 'Proyectos', href: '/projects', icon: FolderKanban },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

const secondaryNavigation = [
  { name: 'Ayuda', href: '/help', icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const {logout} = useAuth()

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="flex h-16 items-center border-b border-slate-100 px-6">
        <Link href="/projects" className="flex items-center gap-2 font-bold text-slate-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-100">
            <Layout size={18} />
          </div>
          <span>SaaS Proyecta</span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <div className="mb-6 px-2">
          <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Organización
          </p>
          <TenantSelector />
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon size={18} className={cn('transition-colors', isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-900')} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <nav className="mt-auto pt-6 space-y-1">
          {secondaryNavigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-900"
            >
              <item.icon size={18} className="text-slate-400 transition-colors group-hover:text-slate-900" />
              {item.name}
            </Link>
          ))}
          
          <button
            onClick={logout}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition-all duration-200 hover:bg-rose-50"
          >
            <LogOut size={18} className="text-rose-400 transition-colors group-hover:text-rose-600" />
            Cerrar sesión
          </button>
        </nav>
      </div>

      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-inner">
            <UserIcon size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-900">{user?.email}</p>
            <p className="truncate text-[10px] text-slate-500">Plan Free</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
