import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.provider';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { MembershipModule } from '../memberships/membership.module';
import { PermissionModule } from '../permissions/permission.module';

@Module({
  imports: [DbModule, MembershipModule, PermissionModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
