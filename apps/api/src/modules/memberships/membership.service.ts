
import { Injectable } from "@nestjs/common";
import { MembershipRepository, MembershipWithTenant } from "./membership.repository";
import { Membership } from "src/db/schema";

@Injectable()
export class MembershipService {
    constructor(private readonly membershipRepository: MembershipRepository) {}

    async createMembership(data: {userId: string, tenantId: string, roleId: string}) {
        return this.membershipRepository.createMembership(data);
    }

    async getUserMemberships(userId: string) : Promise<MembershipWithTenant[] | null> {
        return this.membershipRepository.getUserMemberships(userId);
    }

    async getMembership(userId: string, tenantId: string) : Promise<Membership | null> {
        return this.membershipRepository.getMembership(userId, tenantId);
    }

    async validateUserInTenant(userId: string, tenantId: string) : Promise<boolean> {
        const membership = await this.membershipRepository.getMembership(userId, tenantId);
        return !!membership;
    }
}