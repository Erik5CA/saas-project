
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY } from "../decorators/permission.decorator";
import { PermissionService } from "../permission.service";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector, private readonly permissionService: PermissionService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if(!user) {
            throw new UnauthorizedException('Usuario no autenticado');
        }
        const tenantId = request.tenantId;
        if(!tenantId) {
            throw new UnauthorizedException('Tenant no autenticado');
        }

        const permissions = await this.permissionService.getUserPermissions(user.id, tenantId);
        const hasPermission = requiredPermissions.every((permission) => permissions.includes(permission));
        if(!hasPermission) {
            throw new UnauthorizedException('Usuario no tiene permiso para realizar esta accion');
        }
        return hasPermission;
    }
}