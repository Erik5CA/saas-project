'use client';

import React, { useState } from 'react';
import { useProjects } from '@/hooks/api/useProjects';
import { Button, Card } from '@/components/ui';
import { Plus, FolderKanban, User as UserIcon, Calendar, ArrowRight } from 'lucide-react';
import { CreateProjectModal } from '@/components/dashboard/create-project-modal';

export default function ProjectsPage() {
  const { projectsQuery } = useProjects();
  const { data: response, isLoading } = projectsQuery;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Proyectos</h1>
          <p className="text-slate-500 mt-1">Gestiona y supervisa todos tus proyectos en curso.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg shadow-indigo-100">
          <Plus size={18} />
          Nuevo Proyecto
        </Button>
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />


      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : response?.data.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 px-4 text-center border-dashed border-2 bg-slate-50/50">
          <div className="h-20 w-20 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
            <FolderKanban size={40} />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">No hay proyectos aún</h2>
          <p className="text-slate-500 max-w-sm mt-2 mb-8">
            Comienza creando tu primer proyecto para organizar tu flujo de trabajo.
          </p>
          <Button variant="outline" className="gap-2">
            <Plus size={18} />
            Crear mi primer proyecto
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {response?.data.map((project) => (
            <Card key={project.id} className="group flex flex-col p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FolderKanban size={20} />
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                  En progreso
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                {project.name}
              </h3>
              
              <div className="mt-auto pt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <UserIcon size={14} className="text-slate-400" />
                  <span>Creado por: <span className="font-medium text-slate-700">{project.creator?.email || 'Sistema'}</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar size={14} className="text-slate-400" />
                  <span>Actualizado hace 2 horas</span>
                </div>
                
                <div className="pt-4 flex items-center justify-between border-t border-slate-50 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-semibold text-indigo-600">Ver detalles</span>
                  <ArrowRight size={16} className="text-indigo-600" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
