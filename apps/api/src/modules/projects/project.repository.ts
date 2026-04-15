import { Inject, Injectable } from "@nestjs/common";
import { and, eq, sql, SQL } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import { PaginationResponse } from "src/common/types/pagination-response";
import { PaginationQueryDto } from "src/common/dtos/pagination.dto";
import { PaginationHelper } from "src/common/utils/pagination.helper";
import type { Database } from "src/db";
import { NewProject, projects, users, Project } from "src/db/schema";

@Injectable()
export class ProjectRepository {
    constructor(@Inject('DB') private readonly db: Database) {}

    async createProject(data: NewProject, tx?: PgTransaction<any, any, any>) {
        const db = tx ?? this.db;
        const [project] = await db.insert(projects).values(data).returning();
        return project;
    }

    async findAll(tenantId: string, pagination: PaginationQueryDto): Promise<PaginationResponse<Project>> {
        const { limit, offset, page } = PaginationHelper.getPaginationParams(pagination);

        const sqlFilters: SQL[] = [eq(projects.tenantId, tenantId)];
        
        if (pagination.search) {
            sqlFilters.push(sql`lower(${projects.name}) like ${`%${pagination.search.toLowerCase()}%`}`);
        }

        const data = await this.db
            .select()
            .from(projects)
            .where(and(...sqlFilters))
            .limit(limit)
            .offset(offset);

        const [{ count }] = await this.db
            .select({ count: sql`count(*)`.mapWith(Number) })
            .from(projects)
            .where(and(...sqlFilters));

        return PaginationHelper.formatResponse(data, count, pagination);
    }

    async findById(id: string, tenantId: string) {
        const [result] = await this.db
            .select({
                project: projects,
                creator: {
                    id: users.id,
                    email: users.email,
                },
            })
            .from(projects)
            .leftJoin(users, eq(projects.createdBy, users.id))
            .where(and(eq(projects.id, id), eq(projects.tenantId, tenantId)))
            .limit(1);

        return result || null;
    }

    async update(id: string, tenantId: string, data: Partial<NewProject>) {
        const [project] = await this.db
            .update(projects)
            .set(data)
            .where(and(eq(projects.id, id), eq(projects.tenantId, tenantId)))
            .returning();
        return project || null;
    }

    async delete(id: string, tenantId: string) {
        const [project] = await this.db
            .delete(projects)
            .where(and(eq(projects.id, id), eq(projects.tenantId, tenantId)))
            .returning();
        return project || null;
    }
}