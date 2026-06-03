import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCoverageDto } from './dto/create-coverage.dto';
import { UpdateCoverageDto } from './dto/update-coverage.dto';
import { FilterCoveragesDto } from './dto/FiltersCoveragesDto';

@Injectable()
export class CoveragesService {
  constructor(private prisma: PrismaService) { }

  create(data: CreateCoverageDto) {
    return this.prisma.coverage.create({
      data,
    });
  }

  async findAll(filters: FilterCoveragesDto) {
    const { page = 1, limit = 10, ...queryFilters } = filters;
    const skip = (page - 1) * limit;

    const whereCondition = {
      name: queryFilters.name
        ? {
            contains: queryFilters.name,
            mode: 'insensitive' as const,
          }
        : undefined,
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.coverage.count({ where: whereCondition }),
      this.prisma.coverage.findMany({
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
    return this.prisma.coverage.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCoverageDto: UpdateCoverageDto) {
    return this.prisma.coverage.update({
      where: { id },
      data: updateCoverageDto,
    });
  }

  remove(id: number) {
    return this.prisma.coverage.delete({
      where: { id },
    });
  }
}
