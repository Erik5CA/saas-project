import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { TenantGuard } from '../tenant/guards/tenant.guard';
import { PermissionGuard } from '../permissions/guards/permission.guard';
import { Permission } from '../permissions/decorators/permission.decorator';
import type { AuthenticatedRequestWithTenant } from '../auth/interfaces/auth.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(TenantGuard,PermissionGuard)
  @Permission('view_users')
  async findAll(@Request() req: AuthenticatedRequestWithTenant) {
    return await this.userService.findAll({
      pagination: {
        page: 1,
        limit: 10,
      },
      filters: {
        tenantId: req.tenantId,
      },
    });
  }
}
