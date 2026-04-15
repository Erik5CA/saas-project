import { Module } from "@nestjs/common";
import { TenantService } from "./tenant.service";
import { TenantRepository } from "./tenant.repository";
import { TenantGuard } from "./guards/tenant.guard";
import { MembershipModule } from "../memberships/membership.module";
import { TenantController } from "./tenant.controller";
import { RoleModule } from "../roles/role.module";

@Module({
    imports: [MembershipModule, RoleModule],
    controllers: [TenantController],
    providers: [TenantService, TenantRepository, TenantGuard],
    exports: [TenantService, TenantRepository, TenantGuard],
})
export class TenantModule {}

