import { Module } from "@nestjs/common";
import { TenantService } from "./tenant.service";
import { TenantRepository } from "./tenant.repository";
import { TenantGuard } from "./guards/tenant.guard";
import { MembershipModule } from "../memberships/membership.module";

@Module({
    imports: [MembershipModule],
    providers: [TenantService, TenantRepository, TenantGuard],
    exports: [TenantService, TenantRepository, TenantGuard],
})
export class TenantModule {}
