import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { SetupPasswordDto } from './dto/setup-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async getTokens(userId: number, email: string, role: string, clinicId: number | null) {
        const payload = { sub: userId, email, role, clinicId };

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

        if (user.status !== 'ACTIVE') {
            throw new ForbiddenException('Debe establecer su contraseña antes de iniciar sesión');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const tokens = await this.getTokens(user.id, user.email || '', user.role, user.clinicId);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                dni: user.dni,
                email: user.email,
                role: user.role,
                clinicId: user.clinicId,
            },
            ...tokens,
        };
    }

    async setupPassword(dto: SetupPasswordDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                invitationToken: dto.token,
                status: 'INVITED',
                invitationExpiresAt: { gt: new Date() },
            },
        });

        if (!user) {
            throw new BadRequestException('Token de invitación inválido o expirado');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                status: 'ACTIVE',
                invitationToken: null,
                invitationExpiresAt: null,
            },
        });

        return { message: 'Contraseña establecida correctamente. Ya puede iniciar sesión.' };
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

        const tokens = await this.getTokens(user.id, user.email || '', user.role, user.clinicId);
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

    async getMe(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                dni: true,
                email: true,
                role: true,
                clinicId: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        return {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            dni: user.dni,
            email: user.email,
            role: user.role,
            clinicId: user.clinicId,
        };
    }
}