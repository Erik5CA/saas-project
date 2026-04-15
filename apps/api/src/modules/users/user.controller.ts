import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { TenantGuard } from '../tenant/guards/tenant.guard';
import { PermissionGuard } from '../permissions/guards/permission.guard';
import { Permission } from '../permissions/decorators/permission.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(TenantGuard,PermissionGuard)
  @Permission('view_users')
  async findAll() {
    return await this.userService.findAll();
  }
}
