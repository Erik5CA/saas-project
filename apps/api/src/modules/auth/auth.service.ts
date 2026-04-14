import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthUser, JwtPayload } from './interfaces/auth.interface';
import { User } from 'src/db/schema';
import { TenantRepository } from '../tenant/tenant.repository';
import { MembershipRepository } from '../memberships/membership.repository';
import type { Database } from 'src/db';
import { RoleRepository } from '../roles/role.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly roleRepository: RoleRepository,
    private readonly jwtService: JwtService,
    @Inject('DB') private readonly db: Database,
  ) {}

  async validateUser({
    email,
    pass,
  }: {
    email: string;
    pass: string;
  }): Promise<AuthUser | null> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password!);
    if (!isPasswordValid) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;

    return {
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
    };
  }

  async signIn(user: AuthUser): Promise<{ accessToken: string, tenants: {id: string, name: string}[] }> {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    // Buscar los tenants a los que el usuario pertenece
    const tenants = await this.membershipRepository.getUserMemberships(user.id);

    return {
      accessToken,
      tenants: tenants?.map((membership) => ({
        id: membership.tenantId,
        name: membership.tenant.name,
      })) || [],
    };
  }

  async signUp({
    email,
    password,
  }: SignUpDto): Promise<Omit<User, 'password'>> {
    const user = await this.authRepository.findByEmail(email);

    if (user) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser: User
    
    const result = await this.db.transaction(async (tx) => {
      // 1. Crear usuario
      newUser = await this.authRepository.signUp({
        email,
        password: hashedPassword,
        tx
      });

      // 2. Crear tenant
      const newTenant = await this.tenantRepository.createTenant({
        name: `Workspace de ${email}`,
      }, tx);

    // Buscar el rol owner
  const ownerRole = await this.roleRepository.findRoleByName('OWNER');

  if(!ownerRole){
    throw new BadRequestException('No se encontro el rol owner');
  }

    // 3. Crear membresía
    await this.membershipRepository.createMembership({
      userId: newUser.id,
      tenantId: newTenant.id,
      roleId: ownerRole[0].id,
    }, tx);

    return newUser;
  });
  
  if(!result) {
    throw new Error('No se pudo crear el usuario');
  }

  const { password: _, ...userWithoutPassword } = result;
  return userWithoutPassword;
  }
}
