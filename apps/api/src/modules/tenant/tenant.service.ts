import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { TenantRepository } from "./tenant.repository";
import { RoleRepository } from "../roles/role.repository";
import { MembershipRepository } from "../memberships/membership.repository";
import type { Database } from "src/db";

@Injectable()
export class TenantService {
    constructor(
        private readonly tenantRepository: TenantRepository,
        private readonly roleRepository: RoleRepository,
        private readonly membershipRepository: MembershipRepository,
        @Inject('DB') private readonly db: Database
    ) {}

    async createTenant(data: { name: string }) {
        return this.tenantRepository.createTenant(data);
    }

    async createTenantWithMembership(data: { name: string, userId: string }) {
        return await this.db.transaction(async (tx) => {
            // 1. Create Tenant
            const tenant = await this.tenantRepository.createTenant({ name: data.name }, tx);

            // 2. Find Owner Role
            const ownerRole = await this.roleRepository.findRoleByName('OWNER');
            if (!ownerRole) {
                throw new Error('OWNER role not found');
            }

            // 3. Create Membership
            await this.membershipRepository.createMembership({
                userId: data.userId,
                tenantId: tenant.id,
                roleId: ownerRole.id,
            }, tx);

            return tenant;
        });
    }

    async findTenantById(id: string) {
        const tenant = await this.tenantRepository.findTenantById(id);
        if (!tenant) throw new NotFoundException('No se encontro el tenant');
        return tenant;
    }

    async findTenantsByUserId(userId: string) {
        return this.membershipRepository.getUserMemberships(userId);
    }
}