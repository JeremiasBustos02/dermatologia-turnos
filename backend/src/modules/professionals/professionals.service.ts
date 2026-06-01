import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';

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

  findAll() {
  return this.prisma.professional.findMany({
    include: {
      specialties: true,
      coverages: true,
    },
  });
}

  findOne(id: number) {
    return this.prisma.professional.findUnique({
      where: { id },
    });
  }

  update(id: number, updateProfessionalDto: UpdateProfessionalDto) {
    return this.prisma.professional.update({
      where: { id },
      data: updateProfessionalDto,
    });
  }

  remove(id: number) {
    return this.prisma.professional.delete({
      where: { id },
    });
  }
}
