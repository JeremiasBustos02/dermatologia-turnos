import { Controller, Post, Body, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SetupPasswordDto } from './dto/setup-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registro público de paciente' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('setup-password')
  @ApiOperation({ summary: 'Establecer contraseña por primera vez (invitación)' })
  setupPassword(@Body() dto: SetupPasswordDto) {
    return this.authService.setupPassword(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Obtener un nuevo Access Token usando el Refresh Token' })
  async refresh(@Body() body: RefreshTokenDto) {
    try {
      // Verificamos manualmente la firma del refresh token usando su propio secreto
      const payload = await this.jwtService.verifyAsync(body.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return this.authService.refreshTokens(payload.sub, body.refreshToken);
    } catch (e) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión y revocar tokens' })
  logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('access-token')
  getProfile(@Request() req) {
    return this.authService.getMe(req.user.userId);
  }
}