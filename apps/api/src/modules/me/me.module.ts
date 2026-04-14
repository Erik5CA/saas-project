
import { Module } from "@nestjs/common";
import { MeController } from "./me.controller";
import { MembershipModule } from "../memberships/membership.module";

@Module({
    imports: [MembershipModule],
    controllers: [MeController],
})
export class MeModule {}