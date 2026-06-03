import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { FiltersAppointmentsDto } from './dto/FiltersAppointmentsDto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateAppointmentDto) {
    const appointmentDate = new Date(dto.dateTime);

    await this.validateAppointmentDate(appointmentDate);

    await this.validatePatient(dto.patientId);

    await this.validateProfessional(dto.professionalId);

    await this.validateCoverage(
      dto.professionalId,
      dto.coverageId,
    );

    await this.validateSchedule(
      dto.professionalId,
      appointmentDate,
    );

    await this.validateAppointmentConflict(
      dto.professionalId,
      appointmentDate,
    );

    return this.prisma.appointment.create({
      data: {
        patientId: dto.patientId,
        professionalId: dto.professionalId,
        coverageId: dto.coverageId,
        dateTime: appointmentDate,
        notes: dto.notes,
      },
    });
  }

  async findAll(filters: FiltersAppointmentsDto) {
    let dateTime: Date | undefined;

    if (filters.dateTime) {
      dateTime = new Date(filters.dateTime);

      if (isNaN(dateTime.getTime())) {
        throw new BadRequestException(
          'Fecha inválida.',
        );
      }
    }

    return this.prisma.appointment.findMany({
      where: {
        patientId: filters.patientId,
        professionalId: filters.professionalId,
        coverageId: filters.coverageId,
        dateTime: filters.dateTime
          ? new Date(filters.dateTime)
          : undefined,
        notes: filters.notes
          ? {
            contains: filters.notes,
            mode: 'insensitive',
          }
          : undefined,
      },
      include: {
        patient: true,
        professional: true,
        coverage: true,
      },
    });
  }

  async findOne(id: number) {
    const appointment =
      await this.prisma.appointment.findUnique({
        where: { id },
        include: {
          patient: true,
          professional: true,
          coverage: true,
        },
      });

    if (!appointment) {
      throw new NotFoundException(
        `Turno con ID ${id} no encontrado.`,
      );
    }

    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.findOne(id);

    if (
      appointment.status === 'COMPLETED' ||
      appointment.status === 'CANCELLED'
    ) {
      throw new BadRequestException(
        'No se puede modificar un turno finalizado.',
      );
    }

    const patientId =
      updateAppointmentDto.patientId ?? appointment.patientId;

    const professionalId =
      updateAppointmentDto.professionalId ?? appointment.professionalId;

    const coverageId =
      updateAppointmentDto.coverageId ?? appointment.coverageId;

    const appointmentDate =
      updateAppointmentDto.dateTime
        ? new Date(updateAppointmentDto.dateTime)
        : appointment.dateTime;

    await this.validateAppointmentDate(appointmentDate);

    await this.validatePatient(patientId);

    await this.validateProfessional(professionalId);

    await this.validateCoverage(
      professionalId,
      coverageId,
    );

    await this.validateSchedule(
      professionalId,
      appointmentDate,
    );

    await this.validateAppointmentConflict(
      professionalId,
      appointmentDate,
      id,
    );

    return this.prisma.appointment.update({
      where: { id },
      data: updateAppointmentDto,
    });
  }

  private async validatePatient(patientId: number) {
    const patient = await this.prisma.user.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException(
        `Paciente con ID ${patientId} no encontrado.`,
      );
    }

    if (patient.role !== 'PATIENT') {
      throw new BadRequestException(
        'El usuario seleccionado no es un paciente.',
      );
    }

    return patient;
  }

  private async validateProfessional(professionalId: number) {
    const professional = await this.prisma.professional.findUnique({
      where: { id: professionalId },
    });

    if (!professional) {
      throw new NotFoundException(
        `Profesional con ID ${professionalId} no encontrado.`,
      );
    }

    return professional;
  }

  private async validateCoverage(
    professionalId: number,
    coverageId: number,
  ) {
    const coverage = await this.prisma.coverage.findUnique({
      where: { id: coverageId },
    });

    if (!coverage) {
      throw new NotFoundException(
        `Cobertura con ID ${coverageId} no encontrada.`,
      );
    }

    const professionalWithCoverage =
      await this.prisma.professional.findFirst({
        where: {
          id: professionalId,
          coverages: {
            some: {
              id: coverageId,
            },
          },
        },
      });

    if (!professionalWithCoverage) {
      throw new BadRequestException(
        'El profesional no acepta esa cobertura.',
      );
    }

    return coverage;
  }

  private async validateSchedule(
    professionalId: number,
    appointmentDate: Date,
  ) {
    const dayMap = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ] as const;

    const appointmentDay =
      dayMap[appointmentDate.getDay()];

    const schedules = await this.prisma.schedule.findMany({
      where: {
        professionalId,
        dayOfWeek: appointmentDay,
      },
    });

    if (!schedules.length) {
      throw new BadRequestException(
        'El profesional no atiende ese día.',
      );
    }

    const appointmentMinutes =
      appointmentDate.getHours() * 60 +
      appointmentDate.getMinutes();

    const validSchedule = schedules.find((schedule) => {
      const [startHour, startMinute] =
        schedule.startTime.split(':').map(Number);

      const [endHour, endMinute] =
        schedule.endTime.split(':').map(Number);

      const startMinutes =
        startHour * 60 + startMinute;

      const endMinutes =
        endHour * 60 + endMinute;

      const insideRange =
        appointmentMinutes >= startMinutes &&
        appointmentMinutes < endMinutes;

      const respectsDuration =
        (appointmentMinutes - startMinutes) %
        schedule.appointmentDuration ===
        0;

      return insideRange && respectsDuration;
    });

    if (!validSchedule) {
      throw new BadRequestException(
        'El horario solicitado no coincide con la disponibilidad configurada.',
      );
    }

    return validSchedule;
  }

  private async validateAppointmentConflict(
    professionalId: number,
    appointmentDate: Date,
    ignoreAppointmentId?: number,
  ) {
    const existingAppointment =
      await this.prisma.appointment.findFirst({
        where: {
          professionalId,
          dateTime: appointmentDate,
          status: {
            not: 'CANCELLED',
          },
          id: ignoreAppointmentId
            ? {
              not: ignoreAppointmentId,
            }
            : undefined,
        },
      });

    if (existingAppointment) {
      throw new BadRequestException(
        'Ya existe un turno reservado para esa fecha y horario.',
      );
    }

    return existingAppointment;
  }

  private generateAvailableSlots(
    schedule: {
      startTime: string;
      endTime: string;
      appointmentDuration: number;
    },
  ) {
    const slots: string[] = [];

    const [startHour, startMinute] =
      schedule.startTime.split(':').map(Number);

    const [endHour, endMinute] =
      schedule.endTime.split(':').map(Number);

    let currentMinutes =
      startHour * 60 + startMinute;

    const endMinutes =
      endHour * 60 + endMinute;

    while (currentMinutes < endMinutes) {
      const hour = Math.floor(currentMinutes / 60)
        .toString()
        .padStart(2, '0');

      const minute = (currentMinutes % 60)
        .toString()
        .padStart(2, '0');

      slots.push(`${hour}:${minute}`);

      currentMinutes += schedule.appointmentDuration;
    }

    return slots;
  }

  private validateAppointmentDate(
    appointmentDate: Date,
  ) {
    if (isNaN(appointmentDate.getTime())) {
      throw new BadRequestException('Fecha inválida.');
    }

    if (appointmentDate < new Date()) {
      throw new BadRequestException(
        'No se pueden reservar turnos en fechas pasadas.',
      );
    }

    if (
      appointmentDate.getSeconds() !== 0 ||
      appointmentDate.getMilliseconds() !== 0
    ) {
      throw new BadRequestException(
        'Los turnos deben reservarse en horarios exactos.',
      );
    }
  }

  async getAvailableSlots(professionalId: number, date: string) {
    const targetDate = new Date(date);

    if (isNaN(targetDate.getTime())) {
      throw new BadRequestException('Fecha inválida.');
    }

    const dayMap = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ] as const;

    const dayOfWeek = dayMap[targetDate.getDay()];

    const schedules = await this.prisma.schedule.findMany({
      where: {
        professionalId,
        dayOfWeek,
      },
    });

    await this.validateProfessional(professionalId);

    if (!schedules.length) {
      return [];
    }

    const allSlots = schedules.flatMap((schedule) =>
      this.generateAvailableSlots(schedule),
    );

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        professionalId,
        status: {
          not: 'CANCELLED',
        },
        dateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      }
    });

    const takenSlots = appointments.map((a) =>
      new Date(a.dateTime).toTimeString().slice(0, 5),
    );

    const availableSlots = allSlots.filter(
      (slot) => !takenSlots.includes(slot),
    );

    return availableSlots;
  }

  async confirmAppointment(id: number) {
    const appointment = await this.findOne(id);

    if (appointment.status !== 'PENDING') {
      throw new BadRequestException(
        'Solo se pueden confirmar turnos pendientes.',
      );
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CONFIRMED' },
    });
  }

  async cancelAppointment(id: number) {
    const appointment = await this.findOne(id);

    if (appointment.status === 'CANCELLED') {
      throw new BadRequestException(
        'El turno ya está cancelado.',
      );
    }

    if (appointment.status === 'COMPLETED') {
      throw new BadRequestException(
        'No se pueden cancelar turnos completados.',
      );
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async completeAppointment(id: number) {
    const appointment = await this.findOne(id);

    if (appointment.status !== 'CONFIRMED') {
      throw new BadRequestException(
        'Solo se pueden completar turnos confirmados.',
      );
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
  }
}

