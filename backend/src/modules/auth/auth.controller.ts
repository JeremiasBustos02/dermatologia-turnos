import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth-guard';

import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtPayload } from './dto/JwtPayload';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(
      dto.dni,
      dto.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    const user = req.user as JwtPayload;

    return {
      id: user.userId,
      dni: user.dni,
      role: user.role,
    };
  }
}