import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { FilterProfessionalsDto } from './dto/FilterProfessionalsDto';
import * as bcrypt from 'bcrypt';
import { UserRole, UserStatus } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class ProfessionalsService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateProfessionalDto) {
    const invitationToken = crypto.randomUUID();
    const invitationExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    return this.prisma.$transaction(async (tx) => {
      let user = await tx.user.findUnique({ where: { dni: dto.dni } });

      if (user) {
        if (user.role === UserRole.PROFESSIONAL) {
          throw new ConflictException('El DNI ya corresponde a un profesional registrado');
        }

        user = await tx.user.update({
          where: { id: user.id },
          data: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: UserRole.PROFESSIONAL,
            status: UserStatus.INVITED,
            invitationToken,
            invitationExpiresAt,
          },
        });
      } else {
        const defaultPassword = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        user = await tx.user.create({
          data: {
            dni: dto.dni,
            firstName: dto.firstName,
            lastName: dto.lastName,
            password: hashedPassword,
            role: UserRole.PROFESSIONAL,
            status: UserStatus.INVITED,
            invitationToken,
            invitationExpiresAt,
          },
        });
      }

      const professional = await tx.professional.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          licenseNumber: dto.licenseNumber,
          userId: user.id,
          specialties: {
            connect: dto.specialtyIds.map(id => ({ id })),
          },
          coverages: {
            connect: dto.coverageIds.map(id => ({ id })),
          },
        },
        include: {
          specialties: { select: { id: true, name: true } },
          coverages: { select: { id: true, name: true } },
          user: { select: { id: true, dni: true, role: true, status: true } },
        },
      });

      return { ...professional, invitationToken };
    });
  }

  async findAll(filters: FilterProfessionalsDto) {
    const { page = 1, limit = 10, ...queryFilters } = filters;
    const skip = (page - 1) * limit;

    const whereCondition = {
      firstName: queryFilters.firstName
        ? {
            contains: queryFilters.firstName,
            mode: 'insensitive' as const,
          }
        : undefined,
      lastName: queryFilters.lastName
        ? {
            contains: queryFilters.lastName,
            mode: 'insensitive' as const,
          }
        : undefined,
      licenseNumber: queryFilters.licenseNumber,
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.professional.count({ where: whereCondition }),
      this.prisma.professional.findMany({
        where: whereCondition,
        skip,
        take: limit,
        include: {
          specialties: { select: { id: true, name: true } },
          coverages: { select: { id: true, name: true } },
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

  findOne(id: number) {
    return this.prisma.professional.findUnique({
      where: { id },
      include: {
        specialties: { select: { id: true, name: true } },
        coverages: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: number, updateProfessionalDto: UpdateProfessionalDto) {
    const { specialtyIds, coverageIds, dni, ...professionalData } = updateProfessionalDto;

    return this.prisma.professional.update({
      where: { id },
      data: {
        ...professionalData,

        specialties: specialtyIds ? {
          set: specialtyIds.map(id => ({ id }))
        } : undefined,

        coverages: coverageIds ? {
          set: coverageIds.map(id => ({ id }))
        } : undefined,
      },
      include: {
        specialties: { select: { id: true, name: true } },
        coverages: { select: { id: true, name: true } },
      },
    });
  }

  remove(id: number) {
    return this.prisma.professional.delete({
      where: { id },
      include: {
        specialties: true,
        coverages: true,
      },
    });
  }
}
