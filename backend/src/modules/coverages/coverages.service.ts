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

  findAll(filters: FilterCoveragesDto) {
    return this.prisma.coverage.findMany({
      where: {
        name: filters.name
          ? {
            contains: filters.name,
            mode: 'insensitive',
          }
          : undefined,
      },
    });
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
