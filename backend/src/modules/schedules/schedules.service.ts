import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterSchedulesDto } from './dto/FiltersSchedulesDto';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateScheduleDto) {
    const professional = await this.prisma.professional.findUnique({
      where: {
        id: dto.professionalId,
      },
    });

    if (!professional) {
      throw new BadRequestException(
        'El profesional no existe',
      );
    }

    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException(
        'La hora de fin debe ser mayor que la hora de inicio',
      );
    }

    return this.prisma.schedule.create({
      data: dto,
    });
  }

  findAll(filters: FilterSchedulesDto) {
    return this.prisma.schedule.findMany({
      where: {
        professionalId: filters.professionalId,
        dayOfWeek: filters.dayOfWeek,
        startTime: filters.startTime,
        endTime: filters.endTime,
      },
      include: {
        professional: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.schedule.findUnique({
      where: { id },
      include: {
        professional: true,
      },
    });
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    const professional = await this.prisma.professional.findUnique({
      where: {
        id: updateScheduleDto.professionalId,
      },
    });

    if (!professional) {
      throw new BadRequestException(
        'El profesional no existe',
      );
    }

    return this.prisma.schedule.update({
      where: { id },
      data: updateScheduleDto,
      include: {
        professional: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.schedule.delete({
      where: { id },
      include: {
        professional: true,
      },
    });
  }
}
