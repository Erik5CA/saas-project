import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.provider';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { MembershipModule } from '../memberships/membership.module';

@Module({
  imports: [DbModule, MembershipModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
