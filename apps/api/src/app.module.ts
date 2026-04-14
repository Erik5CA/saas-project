import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './modules/db/db.provider';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt.guard';
import { MeModule } from './modules/me/me.module';
import { MembershipModule } from './modules/memberships/membership.module';
import { TenantModule } from './modules/tenant/tenant.module';

@Module({
  imports: [DbModule, AuthModule, UserModule, MeModule, MembershipModule, TenantModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}

