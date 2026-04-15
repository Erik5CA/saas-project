import React, { useEffect, useState } from 'react';
import { useTenants } from '@/hooks/api/useTenants';
import { useTenantContext } from '@/contexts/tenant-context';
import { ChevronDown, Building2, Check, Plus } from 'lucide-react';
import { cn } from '../ui';
import { CreateTenantModal } from './create-tenant-modal';

export function TenantSelector() {
  const { tenantsQuery } = useTenants();
  const memberships = tenantsQuery.data;
  const isLoading = tenantsQuery.isLoading;
  const { tenantId, setTenantId } = useTenantContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-select first tenant if none selected
  useEffect(() => {
    if (!tenantId && memberships && memberships.length > 0) {
      setTenantId(memberships[0].tenantId);
    }
  }, [memberships, tenantId, setTenantId]);

  const activeMembership = memberships?.find(m => m.tenantId === tenantId);

  if (isLoading) {
    return (
      <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
    );
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <div className="flex items-center gap-2 truncate">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-50 text-indigo-600">
              <Building2 size={16} />
            </div>
            <span className="truncate">
              {activeMembership?.tenant?.name || 'Seleccionar...'}
            </span>
          </div>
          <ChevronDown size={14} className={cn('text-slate-400 transition-transform', isOpen && 'rotate-180')} />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)} 
            />
            <div className="absolute left-0 top-full z-20 mt-2 w-full origin-top animate-in fade-in zoom-in-95 duration-200">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-1 space-y-0.5">
                  {memberships?.map((membership) => (
                    <button
                      key={membership.id}
                      onClick={() => {
                        setTenantId(membership.tenantId);
                        setIsOpen(false);
                      }}
                      className={cn(
                        'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50',
                        tenantId === membership.tenantId ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
                      )}
                    >
                      <span className="truncate">{membership.tenant?.name}</span>
                      {tenantId === membership.tenantId && <Check size={14} />}
                    </button>
                  ))}
                  
                  <div className="pt-1 border-t border-slate-100 mt-1">
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setIsOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
                    >
                      <Plus size={14} />
                      Nueva Organización
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <CreateTenantModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}

