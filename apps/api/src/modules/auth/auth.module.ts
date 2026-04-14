
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { UserModule } from "../users/user.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { TenantRepository } from "../tenant/tenant.repository";
import { MembershipRepository } from "../memberships/membership.repository";
import { RoleRepository } from "../roles/role.repository";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1d' },
        }),
        UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository, LocalStrategy, JwtStrategy, TenantRepository, MembershipRepository, RoleRepository],
    exports: [AuthService, AuthRepository],
})
export class AuthModule {}