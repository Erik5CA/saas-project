
import { Inject, Injectable } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import type { Database } from "src/db";
import { memberships, permissions, rolePermissions } from "src/db/schema";

@Injectable()
export class PermissionRepository {
    constructor(@Inject('DB') private readonly db: Database) {}

    /**
     * Obtiene los permisos de un usuario en un tenant
     * @param userId ID del usuario
     * @param tenantId ID del tenant
     * @returns Lista de acciones que puede realizar el usuario en el tenant
     */
    async getUserPermissions(userId: string, tenantId: string): Promise<string[]> {

        const result = await this.db
    .select({
      action: permissions.action,
    })
    .from(memberships)
    .where(
      and(
        eq(memberships.userId, userId),
        eq(memberships.tenantId, tenantId)
      )
    )
    .innerJoin(rolePermissions, eq(memberships.roleId, rolePermissions.roleId))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id));

  if (result.length === 0) {
    return [];
  }

  return [...new Set(result.map((r) => r.action))];
    }
}