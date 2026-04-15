import { Controller, Post, Body, Get, Request } from "@nestjs/common";
import { TenantService } from "./tenant.service";
import { CreateTenantDto } from "./dtos/create-tenant.dto";
import type { AuthenticatedRequest } from "../auth/interfaces/auth.interface";

@Controller('tenants')
export class TenantController {
    constructor(private readonly tenantService: TenantService) {}

    @Post()
    async create(@Body() data: CreateTenantDto, @Request() req: AuthenticatedRequest) {
        return this.tenantService.createTenantWithMembership({
            name: data.name,
            userId: req.user.id,
        });
    }

    @Get()
    async findAll(@Request() req: AuthenticatedRequest) {
        return this.tenantService.findTenantsByUserId(req.user.id);
    }
}
