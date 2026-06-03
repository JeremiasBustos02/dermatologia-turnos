import { Injectable, BadRequestException } from '@nestjs/common';
import { DayOfWeek } from '@prisma/client';
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

    await this.validateScheduleOverlap(
      dto.professionalId,
      dto.dayOfWeek,
      dto.startTime,
      dto.endTime,
    );

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

  async findOne(id: number) {
    const schedule =
      await this.prisma.schedule.findUnique({
        where: { id },
        include: {
          professional: true,
        },
      });

    if (!schedule) {
      throw new BadRequestException(
        `Horario con ID ${id} no encontrado.`,
      );
    }

    return schedule;
  }

  async update(
    id: number,
    updateScheduleDto: UpdateScheduleDto,
  ) {
    const schedule = await this.findOne(id);

    if (!schedule) {
      throw new BadRequestException(
        'El horario no existe',
      );
    }

    const professionalId =
      updateScheduleDto.professionalId ??
      schedule.professionalId;

    const dayOfWeek =
      updateScheduleDto.dayOfWeek ??
      schedule.dayOfWeek;

    const startTime =
      updateScheduleDto.startTime ??
      schedule.startTime;

    const endTime =
      updateScheduleDto.endTime ??
      schedule.endTime;

    const professional =
      await this.prisma.professional.findUnique({
        where: {
          id: professionalId,
        },
      });

    if (!professional) {
      throw new BadRequestException(
        'El profesional no existe',
      );
    }

    if (startTime >= endTime) {
      throw new BadRequestException(
        'La hora de fin debe ser mayor que la hora de inicio',
      );
    }

    await this.validateScheduleOverlap(
      professionalId,
      dayOfWeek,
      startTime,
      endTime,
      id,
    );

    return this.prisma.schedule.update({
      where: { id },
      data: updateScheduleDto,
      include: {
        professional: true,
      },
    });
  }

  private async validateScheduleOverlap(
    professionalId: number,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    ignoreScheduleId?: number,
  ) {
    const overlappingSchedule =
      await this.prisma.schedule.findFirst({
        where: {
          professionalId,
          dayOfWeek,

          id: ignoreScheduleId
            ? {
              not: ignoreScheduleId,
            }
            : undefined,

          AND: [
            {
              startTime: {
                lt: endTime,
              },
            },
            {
              endTime: {
                gt: startTime,
              },
            },
          ],
        },
      });

    if (overlappingSchedule) {
      throw new BadRequestException(
        'Ya existe un horario superpuesto para ese profesional.',
      );
    }
  }

  async remove(id: number) {
    const schedule = await this.findOne(id);

    return this.prisma.schedule.delete({
      where: { id },
    });
  }

}

