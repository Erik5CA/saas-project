import { Injectable, NotFoundException } from "@nestjs/common";
import { TenantRepository } from "./tenant.repository";

@Injectable()
export class TenantService {
    constructor(private readonly tenantRepository: TenantRepository) {}

    async createTenant(data: {name: string}) {
        return this.tenantRepository.createTenant(data);
    }

    async findTenantById(id: string) {
        const tenant = await this.tenantRepository.findTenantById(id);
        if(!tenant) throw new NotFoundException('No se encontro el tenant');
        return tenant;
    }

    async findTenantsByUserId(userId: string) {
        return this.tenantRepository.findTenantsByUserId(userId);
    }
}