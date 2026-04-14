import { Controller, Get, Request } from "@nestjs/common";
import type { AuthenticatedRequest } from "../auth/interfaces/auth.interface";
import { MembershipService } from "../memberships/membership.service";

@Controller('me')
export class MeController {
    constructor(private readonly membershipServive: MembershipService) {}

    @Get('tenants')
    async getTenants(@Request() req: AuthenticatedRequest) {
        return this.membershipServive.getUserMemberships(req.user.id);
    }
}