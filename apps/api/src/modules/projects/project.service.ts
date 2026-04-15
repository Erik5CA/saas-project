import { Injectable, NotFoundException } from "@nestjs/common";
import { ProjectRepository } from "./project.repository";
import { PaginationQueryDto } from "src/common/dtos/pagination.dto";
import { UpdateProjectDto } from "./dtos/update-project.dto";

@Injectable()
export class ProjectService {
    constructor(private readonly projectRepository: ProjectRepository) {}

    async createProject(data: { name: string, tenantId: string, createdById: string }) {
        return this.projectRepository.createProject({
            name: data.name,
            tenantId: data.tenantId,
            createdBy: data.createdById,
        });
    }

    async findAll(tenantId: string, pagination: PaginationQueryDto) {
        return this.projectRepository.findAll(tenantId, pagination);
    }

    async findById(id: string, tenantId: string) {
        const result = await this.projectRepository.findById(id, tenantId);
        if (!result) throw new NotFoundException('Proyecto no encontrado');
        return result;
    }

    async update(id: string, tenantId: string, data: UpdateProjectDto) {
        const project = await this.projectRepository.update(id, tenantId, data);
        if (!project) throw new NotFoundException('Proyecto no encontrado o no autorizado');
        return project;
    }

    async delete(id: string, tenantId: string) {
        const project = await this.projectRepository.delete(id, tenantId);
        if (!project) throw new NotFoundException('Proyecto no encontrado o no autorizado');
        return { message: 'Proyecto eliminado correctamente' };
    }
}