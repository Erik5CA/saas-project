import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { TenantGuard } from '../tenant/guards/tenant.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(TenantGuard)
  async findAll() {
    return await this.userService.findAll();
  }
}
