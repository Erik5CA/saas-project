'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

interface TenantContextType {
  tenantId: string | null;
  setTenantId: (id: string) => void;
  clearTenantId: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenantId, _setTenantId] = useState<string | null>(null);

  useEffect(() => {
    const cookies = parseCookies();
    const savedTenantId = cookies['selected_tenant_id'];
    if (savedTenantId) {
      _setTenantId(savedTenantId);
    }
  }, []);

  const setTenantId = (id: string) => {
    setCookie(null, 'selected_tenant_id', id, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    _setTenantId(id);
  };

  const clearTenantId = () => {
    destroyCookie(null, 'selected_tenant_id', { path: '/' });
    _setTenantId(null);
  };

  return (
    <TenantContext.Provider value={{ tenantId, setTenantId, clearTenantId }}>
      {children}
    </TenantContext.Provider>
  );
}


export const useTenantContext = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenantContext must be used within a TenantProvider');
  return context;
};
