
import { Inject, Injectable } from "@nestjs/common";
import type { Database } from "src/db";
import { Role, roles } from "src/db/schema";
import { eq } from "drizzle-orm";

@Injectable()
export class RoleRepository {
    constructor(@Inject('DB') private readonly db: Database) {}

    async findRoleByName(name: string) : Promise<Role | null> {
        const role = await this.db.select().from(roles).where(eq(roles.name, name)).limit(1);
        return role[0] || null;
    }
}