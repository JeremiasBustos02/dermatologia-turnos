import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import * as bcrypt from 'bcrypt';
import { FilterUsersDto } from './dto/FilterUsersDto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateUserDto) {
    const { coverageId, ...userFields } = dto;
    let password = dto.password;

    if (!password && dto.role === UserRole.PATIENT) {
      password = dto.dni;
    }

    if (!password) {
      throw new BadRequestException('Password requerida para este rol');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const coverageSelect = {
      id: true,
      name: true,
    };

    return this.prisma.user.create({
      data: {
        ...userFields,
        password: hashedPassword,
        coverage: coverageId ? { connect: { id: coverageId } } : undefined,
      },
      select: {
        id: true,
        dni: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        coverage: { select: coverageSelect },
      }
    });
  }

  async findAll(filters: FilterUsersDto) {
    const { page = 1, limit = 10, ...queryFilters } = filters;
    const skip = (page - 1) * limit;

    const whereCondition = {
      dni: queryFilters.dni,
      email: queryFilters.email,
      role: queryFilters.role,
      firstName: queryFilters.firstName
        ? { contains: queryFilters.firstName, mode: 'insensitive' as const }
        : undefined,
      lastName: queryFilters.lastName
        ? { contains: queryFilters.lastName, mode: 'insensitive' as const }
        : undefined,
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.user.count({ where: whereCondition }),
      this.prisma.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
        select: {
          id: true,
          dni: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          coverage: { select: { id: true, name: true } },
        },
      }),
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: lastPage === 0 ? 1 : lastPage,
      },
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        dni: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        coverage: { select: { id: true, name: true } },
      },
    });

    if (!user) {
      throw new NotFoundException(`No existe un usuario con ID ${id}`);
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const { coverageId, ...userData } = dto;

    return this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        coverage: coverageId
          ? { connect: { id: coverageId } }
          : coverageId === null
            ? { disconnect: true }
            : undefined,
      },
      include: {
        coverage: { select: { id: true, name: true } },
      },
    });
  }

  async getMyProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        dni: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        clinicId: true,
        clinic: { select: { id: true, name: true } },
        coverage: { select: { id: true, name: true } },
        professionalProfile: {
          select: {
            licenseNumber: true,
            specialties: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`No existe un usuario con ID ${userId}`);
    }

    return {
      userId: user.id,
      dni: user.dni,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      clinicId: user.clinicId,
      clinic: user.clinic,
      coverage: user.coverage,
      professionalProfile: user.professionalProfile,
    };
  }

  async updateMyProfile(userId: number, dto: UpdateMyProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { professionalProfile: { select: { id: true } } },
    });

    if (!user) {
      throw new NotFoundException(`No existe un usuario con ID ${userId}`);
    }

    const { specialtyIds, licenseNumber, ...userData } = dto;

    if (userData.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });
      if (existingEmail && existingEmail.id !== userId) {
        throw new BadRequestException('El email ya se encuentra registrado por otro usuario');
      }
    }

    if (Object.keys(userData).length > 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: userData,
      });
    }

    if (user.role === UserRole.PROFESSIONAL) {
      const professionalData: Record<string, any> = {};
      if (licenseNumber !== undefined) professionalData.licenseNumber = licenseNumber;
      if (specialtyIds) {
        professionalData.specialties = {
          set: specialtyIds.map((id) => ({ id })),
        };
      }

      if (Object.keys(professionalData).length > 0) {
        await this.prisma.professional.upsert({
          where: { userId },
          create: {
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            ...professionalData,
          },
          update: professionalData,
        });
      }
    }

    return this.getMyProfile(userId);
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findByDni(dni: string) {
    const user = await this.prisma.user.findUnique({
      where: { dni },
      select: {
        id: true,
        dni: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        coverage: { select: { id: true, name: true } },
      },
    });

    if (!user) {
      throw new NotFoundException(`No existe un usuario con DNI ${dni}`);
    }

    return user;
  }

  async findByDniForAuth(dni: string) {
    return this.prisma.user.findUnique({
      where: { dni },
    });
  }
}
