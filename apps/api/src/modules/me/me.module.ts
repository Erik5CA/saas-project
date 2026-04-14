
import { Module } from "@nestjs/common";
import { MeController } from "./me.controller";
import { MembershipService } from "../memberships/membership.service";
import { MembershipRepository } from "../memberships/membership.repository";

@Module({
    controllers: [MeController],
    providers: [MembershipService, MembershipRepository],
})
export class MeModule {}