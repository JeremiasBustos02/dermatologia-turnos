import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { FiltersSpecialtiesDto } from './dto/FiltersSpecialtiesDto';

@Injectable()
export class SpecialtiesService {
  constructor(private prisma: PrismaService) { }

  create(data: CreateSpecialtyDto) {
    return this.prisma.specialty.create({
      data,
    });
  }

  async findAll(filters: FiltersSpecialtiesDto) {
    const { page = 1, limit = 10, ...queryFilters } = filters;
    const skip = (page - 1) * limit;

    const whereCondition = {
      name: queryFilters.name
        ? {
            contains: queryFilters.name,
            mode: 'insensitive' as const,
          }
        : undefined,
      description: queryFilters.description
        ? {
            contains: queryFilters.description,
            mode: 'insensitive' as const,
          }
        : undefined,
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.specialty.count({ where: whereCondition }),
      this.prisma.specialty.findMany({
        where: whereCondition,
        skip,
        take: limit,
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
    return this.prisma.specialty.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateSpecialtyDto) {
    return this.prisma.specialty.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.specialty.delete({ where: { id } });
  }
}
