import { Inject, Injectable } from '@nestjs/common';
import { and, eq, sql, SQL } from 'drizzle-orm';
import { PaginationResponse } from 'src/common/types/pagination-response';
import { QueryPagination } from 'src/common/types/query-pagination';
import type { Database } from 'src/db';
import { memberships, roles, User, users } from 'src/db/schema';

@Injectable()
export class UserRepository {
  constructor(@Inject('DB') private readonly db: Database) {}

  async findAll({
    pagination,
    filters
  }: {
    pagination?: QueryPagination;
    filters?: {
      email?: string;
      name?: string;
      tenantId?: string;
    };
  }) : Promise<PaginationResponse<Omit<User, 'password'>>> {

    const { page = 1, limit = 10, search, orderBy, orderDir } = pagination || {};
    const offset = (page - 1) * limit;

    const sqlFilters: SQL[] = [];
    
    // if(filters?.email) sqlFilters.push(eq(users.email, filters.email));
    // if(filters?.name) sqlFilters.push(eq(users.name, filters.name));
    if(filters?.tenantId) sqlFilters.push(eq(memberships.tenantId, filters.tenantId));
    
    const result = await this.db.select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      role: roles
    }).from(memberships).innerJoin(users, eq(memberships.userId, users.id)).innerJoin(roles, eq(memberships.roleId, roles.id)).where(and(...sqlFilters)).limit(limit).offset(offset);

    const [{count}] = await this.db.select({
      count: sql`count(*)` as SQL<number>
    }).from(memberships).innerJoin(users, eq(memberships.userId, users.id)).innerJoin(roles, eq(memberships.roleId, roles.id)).where(and(...sqlFilters));

    return {
      data: result,
      pagination: {
        page: page,
        limit: limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      }
    }
  }
}
