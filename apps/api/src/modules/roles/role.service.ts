
import { Injectable, NotFoundException } from "@nestjs/common";
import { RoleRepository } from "./role.repository";

@Injectable()
export class RoleService {
    constructor(private readonly roleRepository: RoleRepository) {}

    async findRoleByName(name: string) {
        const role = await this.roleRepository.findRoleByName(name);
        if(!role) throw new NotFoundException('No se encontro el rol');
        return role;
    }
}