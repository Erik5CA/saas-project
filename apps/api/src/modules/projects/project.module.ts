
import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectRepository } from "./project.repository";
import { ProjectController } from "./project.controller";
import { MembershipModule } from "../memberships/membership.module";
import { PermissionModule } from "../permissions/permission.module";

@Module({
    imports: [MembershipModule, PermissionModule],
    providers: [ProjectService, ProjectRepository],
    controllers: [ProjectController],
    exports: [ProjectService, ProjectRepository],
})
export class ProjectModule {}