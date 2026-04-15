import { Controller, Post, Body, Get, Patch, Delete, Param, Query, UseGuards, Request } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { TenantGuard } from "../tenant/guards/tenant.guard";
import { PermissionGuard } from "../permissions/guards/permission.guard";
import { Permission } from "../permissions/decorators/permission.decorator";
import { CreateProjectDto } from "./dtos/create-project.dto";
import { UpdateProjectDto } from "./dtos/update-project.dto";
import { PaginationQueryDto } from "src/common/dtos/pagination.dto";
import type { AuthenticatedRequestWithTenant } from "../auth/interfaces/auth.interface";

@Controller('projects')
@UseGuards(TenantGuard, PermissionGuard)
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post()
    @Permission('create_project')
    async createProject(@Body() data: CreateProjectDto, @Request() req: AuthenticatedRequestWithTenant) {
        return this.projectService.createProject({
            name: data.name,
            tenantId: req.tenantId,
            createdById: req.user.id,
        });
    }

    @Get()
    @Permission('view_projects')
    async findAll(@Query() pagination: PaginationQueryDto, @Request() req: AuthenticatedRequestWithTenant) {
        return this.projectService.findAll(req.tenantId, pagination);
    }

    @Get(':id')
    @Permission('view_projects')
    async findById(@Param('id') id: string, @Request() req: AuthenticatedRequestWithTenant) {
        return this.projectService.findById(id, req.tenantId);
    }

    @Patch(':id')
    @Permission('update_project')
    async update(
        @Param('id') id: string,
        @Body() data: UpdateProjectDto,
        @Request() req: AuthenticatedRequestWithTenant
    ) {
        return this.projectService.update(id, req.tenantId, data);
    }

    @Delete(':id')
    @Permission('delete_project')
    async delete(@Param('id') id: string, @Request() req: AuthenticatedRequestWithTenant) {
        return this.projectService.delete(id, req.tenantId);
    }
}