import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthUser, JwtPayload } from './interfaces/auth.interface';
import { User } from 'src/db/schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
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

  async signIn(user: AuthUser): Promise<{ accessToken: string }> {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
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

    const newUser = await this.authRepository.signUp({
      email,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}
