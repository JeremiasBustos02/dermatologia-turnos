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

  findAll(filters: FiltersSpecialtiesDto) {
    return this.prisma.specialty.findMany({
      where: {
        name: filters.name,
        description: filters.description,
      },
    });
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
