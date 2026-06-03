import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async getTokens(userId: number, email: string, role: string) {
        const payload = { sub: userId, email, role };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            }),
        ]);

        return { accessToken, refreshToken };
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hash = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshToken: hash },
        });
    }

    async login(loginDto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { dni: loginDto.dni }
        });

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const tokens = await this.getTokens(user.id, user.email || '', user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                dni: user.dni,
                email: user.email,
                role: user.role,
            },
            ...tokens,
        };
    }

    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.hashedRefreshToken) {
            throw new ForbiddenException('Acceso denegado');
        }

        const rtMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!rtMatches) {
            throw new ForbiddenException('Acceso denegado');
        }

        const tokens = await this.getTokens(user.id, user.email || '', user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async logout(userId: number) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRefreshToken: { not: null },
            },
            data: { hashedRefreshToken: null },
        });
        return { message: 'Sesión cerrada correctamente' };
    }
}