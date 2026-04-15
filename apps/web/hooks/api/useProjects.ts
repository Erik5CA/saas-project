import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api-client';
import { Project, PaginatedResponse } from '../../types/api';
import { useTenantContext } from '../../contexts/tenant-context';

export function useProjects(page = 1, limit = 10) {
  const { tenantId } = useTenantContext();
  const queryClient = useQueryClient();

  // Get all projects (paginated)
  const projectsQuery = useQuery({
    queryKey: ['projects', tenantId, page, limit],
    queryFn: () => 
      api.get<PaginatedResponse<Project>>(`/projects?page=${page}&limit=${limit}`, { tenantId: tenantId! }),
    enabled: !!tenantId,
  });

  // Get project by ID
  const getProjectQuery = (id: string) => 
    useQuery({
      queryKey: ['project', id, tenantId],
      queryFn: () => api.get<Project>(`/projects/${id}`, { tenantId: tenantId! }),
      enabled: !!tenantId && !!id,
    });

  // Create project
  const createProjectMutation = useMutation({
    mutationFn: (data: { name: string }) => 
      api.post<Project>('/projects', data, { tenantId: tenantId! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', tenantId] });
    },
  });

  // Update project
  const updateProjectMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      api.patch<Project>(`/projects/${id}`, { name }, { tenantId: tenantId! }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
    },
  });

  // Delete project
  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => 
      api.delete(`/projects/${id}`, { tenantId: tenantId! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', tenantId] });
    },
  });

  return {
    projectsQuery,
    getProjectQuery,
    createProjectMutation,
    updateProjectMutation,
    deleteProjectMutation,
  };
}
