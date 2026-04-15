import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { Public } from './decorators/public.decorator';
import type { AuthenticatedRequest } from './interfaces/auth.interface';
import { TenantGuard } from '../tenant/guards/tenant.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(
    @Request() req: AuthenticatedRequest
  ) {
    return this.authService.signIn(req.user);
  }

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() signUpDto: SignUpDto,
  ) {
    const user = await this.authService.signUp(signUpDto);
    return {
      message: 'Usuario creado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      }
    };
  }

  @Get('profile')
  @UseGuards(TenantGuard)
  async getProfile(@Request() req: AuthenticatedRequest & {tenantId: string}) {
    const user = req.user;
    return {
      user,
    };
  }
}
