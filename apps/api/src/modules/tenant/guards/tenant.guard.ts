
import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { MembershipService } from "src/modules/memberships/membership.service";

@Injectable()
export class TenantGuard implements CanActivate {
    constructor(private readonly membershipService: MembershipService) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        
        const user = request.user;
        
        if(!user) throw new UnauthorizedException('Usuario no autenticado');

        const tenantId = request.headers["x-tenant-id"]

        if(!tenantId) throw new BadRequestException('Tenant ID no proporcionado');

        const userIsInTenant = await this.membershipService.validateUserInTenant(user.id, tenantId);

        if(!userIsInTenant) {
            throw new UnauthorizedException('Usuario no pertenece al tenant');
        }

        request.tenantId = tenantId;
        return true;
    }
}