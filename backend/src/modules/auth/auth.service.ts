import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dni: string, password: string) {
    const user =
      await this.usersService.findByDniForAuth(dni);

    if (!user) {
      throw new UnauthorizedException(
        'Credenciales inválidas',
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Credenciales inválidas',
      );
    }

    const payload = {
      sub: user.id,
      dni: user.dni,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(
        payload,
      ),
    };
  }
}