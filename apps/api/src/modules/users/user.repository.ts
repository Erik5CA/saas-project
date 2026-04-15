import { Inject, Injectable } from '@nestjs/common';
import { and, eq, sql, SQL } from 'drizzle-orm';
import { PaginationResponse } from 'src/common/types/pagination-response';
import { PaginationQueryDto } from 'src/common/dtos/pagination.dto';
import { PaginationHelper } from 'src/common/utils/pagination.helper';
import type { Database } from 'src/db';
import { memberships, roles, User, users } from 'src/db/schema';

@Injectable()
export class UserRepository {
  constructor(@Inject('DB') private readonly db: Database) {}

  async findAll({
    pagination,
    filters
  }: {
    pagination?: PaginationQueryDto;
    filters?: {
      email?: string;
      name?: string;
      tenantId?: string;
    };
  }) : Promise<PaginationResponse<Omit<User, 'password'>>> {

    const { page, limit, offset } = PaginationHelper.getPaginationParams(pagination || {});

    const sqlFilters: SQL[] = [];
    
    if(filters?.tenantId) sqlFilters.push(eq(memberships.tenantId, filters.tenantId));
    
    const result = await this.db.select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      role: roles
    })
    .from(memberships)
    .innerJoin(users, eq(memberships.userId, users.id))
    .innerJoin(roles, eq(memberships.roleId, roles.id))
    .where(and(...sqlFilters))
    .limit(limit)
    .offset(offset);

    const [{count}] = await this.db.select({
      count: sql`count(*)`.mapWith(Number)
    })
    .from(memberships)
    .innerJoin(users, eq(memberships.userId, users.id))
    .innerJoin(roles, eq(memberships.roleId, roles.id))
    .where(and(...sqlFilters));

    return PaginationHelper.formatResponse(result as any, count, pagination || {});
  }
}

