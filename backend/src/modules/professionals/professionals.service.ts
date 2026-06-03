import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { FilterProfessionalsDto } from './dto/FilterProfessionalsDto';

@Injectable()
export class ProfessionalsService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateProfessionalDto) {
    return this.prisma.professional.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        licenseNumber: dto.licenseNumber,
        specialties: {
          connect: dto.specialtyIds.map(id => ({ id })),
        },

        coverages: {
          connect: dto.coverageIds.map(id => ({ id })),
        },
      },

      include: {
        specialties: true,
        coverages: true,
      },
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
          specialties: true,
          coverages: true,
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
        specialties: true,
        coverages: true,
      },
    });
  }

  update(id: number, updateProfessionalDto: UpdateProfessionalDto) {
    return this.prisma.professional.update({
      where: { id },
      data: updateProfessionalDto,
      include: {
        specialties: true,
        coverages: true,
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
