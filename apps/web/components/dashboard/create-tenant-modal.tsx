'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Input, Button } from '../ui';
import { useTenants } from '@/hooks/api/useTenants';
import { useTenantContext } from '@/contexts/tenant-context';

interface CreateTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTenantModal({ isOpen, onClose }: CreateTenantModalProps) {
  const [name, setName] = useState('');
  const { createTenantMutation } = useTenants();
  const { setTenantId } = useTenantContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createTenantMutation.mutate({ name }, {
      onSuccess: (newTenant) => {
        setName('');
        setTenantId(newTenant.id);
        onClose();
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Organización">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nombre de la organización"
          placeholder="Ej: Acme Corp"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
        
        <p className="text-xs text-slate-500">
          Al crear una organización, serás asignado como el administrador principal (Owner).
        </p>
        
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={createTenantMutation.isPending}>
            Crear Organización
          </Button>
        </div>
      </form>
    </Modal>
  );
}
