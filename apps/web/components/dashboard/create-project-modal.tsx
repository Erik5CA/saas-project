'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import { Input, Button } from '../ui';
import { useProjects } from '@/hooks/api/useProjects';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const { createProjectMutation } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate({ name }, {
      onSuccess: () => {
        setName('');
        onClose();
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Proyecto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nombre del proyecto"
          placeholder="Ej: Rediseño Web 2024"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
        
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={createProjectMutation.isPending}>
            Crear Proyecto
          </Button>
        </div>
      </form>
    </Modal>
  );
}
