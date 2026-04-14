
import { Injectable } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { and, eq, SQL } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import type { Database } from "src/db";
import { Membership, memberships, tenants } from "src/db/schema";

export type MembershipWithTenant = Membership & {
    tenant: {
        id: string;
        name: string;
    }
}

@Injectable()
export class MembershipRepository {
    constructor(@Inject('DB') private readonly db: Database) {}

    async createMembership(data: {userId: string, tenantId: string, roleId: string}, tx?:PgTransaction<any,any,any>) {
        const db = tx ?? this.db;
        return db.insert(memberships).values(data).returning();
    }

    async getUserMemberships(userId: string) : Promise<MembershipWithTenant[] | null> {
        const userMemberships = await this.db.select().from(memberships).where(eq(memberships.userId,userId)).innerJoin(tenants, eq(memberships.tenantId, tenants.id));
        return userMemberships.map((membership) => ({
            ...membership.memberships,
            tenant: membership.tenants,
        }));
    }

    async getMembership(userId: string, tenantId: string) : Promise<Membership | null> {
        const filters: SQL[] = [];
        
        if(userId) filters.push(eq(memberships.userId,userId));
        if(tenantId) filters.push(eq(memberships.tenantId,tenantId));

        const membership = await this.db.select().from(memberships).where(and(...filters))
        return membership[0] || null;
    }
}