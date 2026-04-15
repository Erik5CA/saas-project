'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useTenants } from '@/hooks/api/useTenants';
import { Button, Card } from '@/components/ui';
import { Building2, Plus } from 'lucide-react';
import { CreateTenantModal } from '@/components/dashboard/create-tenant-modal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { tenantsQuery } = useTenants();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasTenants = tenantsQuery.data && tenantsQuery.data.length > 0;
  const isLoading = tenantsQuery.isLoading;

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        {hasTenants && <Sidebar />}
        
        <main className="flex-1 overflow-y-auto px-8 py-8 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-right-4 duration-700 h-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                <p className="text-sm font-medium text-slate-500 animate-pulse">Sincronizando organizaciones...</p>
              </div>
            ) : !hasTenants ? (
              <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="h-24 w-24 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-200 animate-bounce">
                  <Building2 size={48} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bienvenido a Proyecta</h1>
                  <p className="text-slate-500 mt-2">
                    Para comenzar, necesitas crear una organización. Podrás invitar a tu equipo y gestionar proyectos de forma centralizada.
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg gap-3 shadow-xl shadow-indigo-200"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus size={24} />
                  Crear mi Organización
                </Button>

                <CreateTenantModal 
                  isOpen={isModalOpen} 
                  onClose={() => setIsModalOpen(false)} 
                />
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

