import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api-client';
import { Membership, Tenant } from '../../types/api';

export function useTenants() {
  const queryClient = useQueryClient();

  const tenantsQuery = useQuery({
    queryKey: ['tenants'],
    queryFn: () => api.get<Membership[]>('/tenants'),
  });

  const createTenantMutation = useMutation({
    mutationFn: (data: { name: string }) => api.post<Tenant>('/tenants', data),
    onSuccess: (newTenant) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });

  return {
    tenantsQuery,
    createTenantMutation,
  };
}

