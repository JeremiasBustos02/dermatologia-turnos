import { Controller, Post, Body, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto'; // <- Importar el DTO
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService, // <- Inyectar JwtService
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
    // req.user viene del payload del access token gracias al JwtAuthGuard
    return this.authService.logout(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('me')
  @ApiOperation({ summary: 'Obtener datos del usuario logueado' })
  getProfile(@Request() req) {
    return req.user;
  }
}