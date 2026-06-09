import { Injectable, BadRequestException } from '@nestjs/common';
import { DayOfWeek, Prisma, Schedule } from '@prisma/client';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterSchedulesDto } from './dto/FiltersSchedulesDto';
import { UpdateProfessionalSchedulesDto } from './dto/update-professional-schedules.dto';

type ScheduleClient = Prisma.TransactionClient | PrismaService;

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateScheduleDto) {
    return this.prisma.$transaction(async (tx) => {
      const professional = await tx.professional.findUnique({
        where: {
          id: dto.professionalId,
        },
        select: { id: true },
      });

      if (!professional) {
        throw new BadRequestException('El profesional no existe');
      }

      if (dto.startTime >= dto.endTime) {
        throw new BadRequestException('La hora de fin debe ser mayor que la hora de inicio');
      }

      await this.validateScheduleOverlap(
        dto.professionalId,
        dto.dayOfWeek,
        dto.startTime,
        dto.endTime,
        undefined,
        tx,
      );

      return tx.schedule.create({
        data: dto,
      });
    });
  }

  async findAll(filters: FilterSchedulesDto) {
    const { page = 1, limit = 10, ...queryFilters } = filters;
    const skip = (page - 1) * limit;

    const whereCondition = {
      professionalId: queryFilters.professionalId,
      dayOfWeek: queryFilters.dayOfWeek,
      startTime: queryFilters.startTime,
      endTime: queryFilters.endTime,
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.schedule.count({ where: whereCondition }),
      this.prisma.schedule.findMany({
        where: whereCondition,
        skip,
        take: limit,
        include: {
          professional: true,
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
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        professional: true,
      },
    });

    if (!schedule) {
      throw new BadRequestException(`Horario con ID ${id} no encontrado.`);
    }

    return schedule;
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.findOne(id);

    if (!schedule) {
      throw new BadRequestException('El horario no existe');
    }

    const professionalId = updateScheduleDto.professionalId ?? schedule.professionalId;
    const dayOfWeek = updateScheduleDto.dayOfWeek ?? schedule.dayOfWeek;
    const startTime = updateScheduleDto.startTime ?? schedule.startTime;
    const endTime = updateScheduleDto.endTime ?? schedule.endTime;

    const professional = await this.prisma.professional.findUnique({
      where: {
        id: professionalId,
      },
      select: { id: true },
    });

    if (!professional) {
      throw new BadRequestException('El profesional no existe');
    }

    if (startTime >= endTime) {
      throw new BadRequestException('La hora de fin debe ser mayor que la hora de inicio');
    }

    return this.prisma.$transaction(async (tx) => {
      await this.validateScheduleOverlap(
        professionalId,
        dayOfWeek,
        startTime,
        endTime,
        id,
        tx,
      );

      return tx.schedule.update({
        where: { id },
        data: updateScheduleDto,
        select: {
          id: true,
          professionalId: true,
          startTime: true,
          endTime: true,
          appointmentDuration: true,
          dayOfWeek: true,
          professional: { select: { id: true, firstName: true, lastName: true } },
        },
      });
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.schedule.delete({
      where: { id },
    });
  }

  private async validateScheduleOverlap(
    professionalId: number,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    ignoreScheduleId?: number,
    prisma: ScheduleClient = this.prisma,
  ) {
    const overlappingSchedule = await prisma.schedule.findFirst({
      where: {
        professionalId,
        dayOfWeek,
        id: ignoreScheduleId ? { not: ignoreScheduleId } : undefined,
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: startTime } },
        ],
      },
    });

    if (overlappingSchedule) {
      throw new BadRequestException('Ya existe un horario superpuesto para ese profesional.');
    }
  }

  // =========================================================================
  // MÉDODO DE REEMPLAZO MASIVO PARA EL DASHBOARD DEL ADMINISTRADOR
  // =========================================================================
  async replaceProfessionalSchedules(
    professionalId: number,
    dto: UpdateProfessionalSchedulesDto,
  ) {
    const professional = await this.prisma.professional.findUnique({
      where: { id: professionalId },
      select: { id: true },
    });

    if (!professional) {
      throw new BadRequestException('El profesional no existe o fue eliminado');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.schedule.deleteMany({
        where: { professionalId },
      });

      const createdSchedules: Schedule[] = [];

      for (const item of dto.schedules) {
        if (item.startTime >= item.endTime) {
          throw new BadRequestException(
            `Error en el día ${item.dayOfWeek}: La hora de fin (${item.endTime}) debe ser mayor que la de inicio (${item.startTime}).`,
          );
        }

        const overlap = await tx.schedule.findFirst({
          where: {
            professionalId,
            dayOfWeek: item.dayOfWeek,
            AND: [
              { startTime: { lt: item.endTime } },
              { endTime: { gt: item.startTime } },
            ],
          },
        });

        if (overlap) {
          throw new BadRequestException(
            `Existe una superposición de horarios para el día ${item.dayOfWeek} entre las horas configuradas.`,
          );
        }

        const newSchedule = await tx.schedule.create({
          data: {
            professionalId,
            dayOfWeek: item.dayOfWeek,
            startTime: item.startTime,
            endTime: item.endTime,
            appointmentDuration: item.appointmentDuration,
          },
        });

        createdSchedules.push(newSchedule);
      }

      return createdSchedules;
    });
  }
}
