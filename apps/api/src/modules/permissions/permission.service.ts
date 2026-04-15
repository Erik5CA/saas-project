import { Injectable } from "@nestjs/common";
import { PermissionRepository } from "./permission.repository";

@Injectable()
export class PermissionService {
    constructor(private readonly permissionRepository: PermissionRepository) {}

    async getUserPermissions(userId: string, tenantId: string) {
        return this.permissionRepository.getUserPermissions(userId, tenantId);
    }
}