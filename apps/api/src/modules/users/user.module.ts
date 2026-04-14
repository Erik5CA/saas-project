import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.provider';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [DbModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
