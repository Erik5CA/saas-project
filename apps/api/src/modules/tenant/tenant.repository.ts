import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import type { Database } from "src/db";
import { Membership, memberships, Tenant, tenants } from "src/db/schema";

@Injectable()
export class TenantRepository {
    constructor(@Inject('DB') private readonly db: Database) {}

    async createTenant(data: {name: string},tx?:PgTransaction<any,any,any>) {
        const db = tx ?? this.db;
        const tenant = await db.insert(tenants).values(data).returning();
        return tenant[0];
    }

    async findTenantById(id: string) : Promise<Tenant | null> {
        const tenant = await this.db.select().from(tenants).where(eq(tenants.id,id))
        return tenant[0] || null;
    }

    async findTenantsByUserId(userId: string) : Promise<Membership[] | null> {
        const tenants = await this.db.select().from(memberships).where(eq(memberships.userId,userId))
        return tenants
    }
}