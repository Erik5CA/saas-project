export interface User {
  id: string;
  email: string;
  createdAt?: string;
}

export interface Tenant {
  id: string;
  name: string;
  createdAt?: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface Membership {
  id: string;
  userId: string;
  tenantId: string;
  roleId: string;
  tenant?: Tenant;
  role?: Role;
}

export interface Project {
  id: string;
  name: string;
  tenantId: string;
  createdBy: string;
  creator?: {
    id: string;
    email: string;
  };
}

export interface AuthResponse {
  accessToken: string;
  tenants: {
    id: string;
    name: string;
  }[];
  user: User;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
