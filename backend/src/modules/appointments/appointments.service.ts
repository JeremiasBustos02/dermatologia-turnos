import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { FiltersAppointmentsDto } from './dto/FiltersAppointmentsDto';
import { AppointmentStatus, Prisma } from '@prisma/client';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Argentina/Buenos_Aires');

const TIMEZONE = 'America/Argentina/Buenos_Aires';
type BookingClient = Pick<PrismaService, 'user' | 'professional' | 'schedule' | 'appointment'> | Prisma.TransactionClient;

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) { }

  // 🌟 SOLUCIÓN: Agregamos el tipo de intersección para que TypeScript sepa que clinicId viene en el DTO/Request
  async create(dto: CreateAppointmentDto & { clinicId: number }) {
    const appointmentDate = new Date(dto.dateTime);
    this.validateAppointmentDateSync(appointmentDate);

    return this.prisma.$transaction(async (tx) => {
      await this.validateAllBookingRules(
        dto.patientId,
        dto.professionalId,
        dto.coverageId,
        dto.clinicId, // 👈 Pasado correctamente como number
        appointmentDate,
        undefined,
        tx,
      );

      return tx.appointment.create({
        data: {
          patientId: dto.patientId,
          professionalId: dto.professionalId,
          coverageId: dto.coverageId,
          clinicId: dto.clinicId, // 👈 Ya no tira error de propiedad faltante
          dateTime: appointmentDate,
          notes: dto.notes,
        },
      });
    });
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto & { clinicId?: number }) {
    const appointment = await this.findOne(id);

    if (appointment.status === AppointmentStatus.COMPLETED || appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('No se puede modificar un turno finalizado.');
    }

    const patientId = updateAppointmentDto.patientId ?? appointment.patientId;
    const professionalId = updateAppointmentDto.professionalId ?? appointment.professionalId;
    const coverageId = updateAppointmentDto.coverageId ?? appointment.coverageId;
    
    // Resolvemos el clinicId del DTO o usamos el que ya tenía el turno originalmente
    const clinicId = updateAppointmentDto.clinicId ?? appointment.clinicId;

    const appointmentDate = updateAppointmentDto.dateTime
      ? new Date(updateAppointmentDto.dateTime)
      : appointment.dateTime;

    this.validateAppointmentDateSync(appointmentDate);

    return this.prisma.$transaction(async (tx) => {
      // 🌟 SOLUCIÓN AL ERROR 3: Reordenamos los parámetros para que coincidan con la firma de la función
      await this.validateAllBookingRules(
        patientId,
        professionalId,
        coverageId,
        clinicId,        // 4° parámetro: clinicId (number) ✅
        appointmentDate, // 5° parámetro: appointmentDate (Date) ✅
        id,              // 6° parámetro: ignoreAppointmentId (number) ✅
        tx,
      );

      return tx.appointment.update({
        where: { id },
        data: {
          ...updateAppointmentDto,
          dateTime: updateAppointmentDto.dateTime ? appointmentDate : undefined,
        },
      });
    });
  }

  // =====================================================================
  // BÓVEDA DE VALIDACIÓN PARALELA (Evita el N+1 Sequential Fetching)
  // =====================================================================
  private async validateAllBookingRules(
    patientId: number,
    professionalId: number,
    coverageId: number,
    clinicId: number, // 👈 4° parámetro
    appointmentDate: Date, // 👈 5° parámetro
    ignoreAppointmentId?: number,
    tx: BookingClient = this.prisma,
  ) {
    const localDate = dayjs(appointmentDate).tz(TIMEZONE);
    const dayMap = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
    const appointmentDay = dayMap[localDate.day()];

    // Disparamos TODAS las peticiones a la Base de Datos AL MISMO TIEMPO
    const [patient, professional, schedules, existingAppointment] = await Promise.all([
      tx.user.findUnique({ 
        where: { id: patientId }, 
        select: { id: true, role: true, clinicId: true } 
      }),
      tx.professional.findUnique({
        where: { id: professionalId },
        select: { id: true, coverages: { select: { id: true } }, user: { select: { clinicId: true } } },
      }),
      tx.schedule.findMany({
        where: { professionalId, dayOfWeek: appointmentDay },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          appointmentDuration: true,
        },
      }),
      tx.appointment.findFirst({
        where: {
          clinicId, // 👈 Agregado para el aislamiento multi-tenant
          professionalId,
          dateTime: appointmentDate,
          status: { not: 'CANCELLED' },
          id: ignoreAppointmentId ? { not: ignoreAppointmentId } : undefined,
        },
      }),
    ]);

    // 1. Validar Paciente
    if (!patient) throw new NotFoundException(`Paciente con ID ${patientId} no encontrado.`);
    if (patient.role !== 'PATIENT') throw new BadRequestException('El usuario seleccionado no es un paciente.');
    if (patient.clinicId !== clinicId) throw new BadRequestException('El paciente no pertenece a esta clínica.');

    // 2. Validar Profesional y Cobertura (En memoria)
    if (!professional) throw new NotFoundException(`Profesional con ID ${professionalId} no encontrado.`);
    if (professional.user?.clinicId !== clinicId) throw new BadRequestException('El profesional no pertenece a esta clínica.');
    
    const acceptsCoverage = professional.coverages.some((c) => c.id === coverageId);
    if (!acceptsCoverage) throw new BadRequestException('El profesional no acepta esa cobertura médica.');

    // 3. Validar Conflictos
    if (existingAppointment) throw new BadRequestException('Ya existe un turno reservado para esa fecha y horario.');

    // 4. Validar Grilla Horaria (En memoria)
    if (!schedules.length) throw new BadRequestException('El profesional no atiende ese día.');
    
    const appointmentMinutes = localDate.hour() * 60 + localDate.minute();
    const validSchedule = schedules.find((schedule) => {
      const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
      const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      const insideRange = appointmentMinutes >= startMinutes && appointmentMinutes < endMinutes;
      const respectsDuration = (appointmentMinutes - startMinutes) % schedule.appointmentDuration === 0;

      return insideRange && respectsDuration;
    });

    if (!validSchedule) throw new BadRequestException('El horario solicitado no coincide con la disponibilidad configurada.');
  }

  // =====================================================================
  // GENERACIÓN DE SLOTS OPTIMIZADA
  // =====================================================================
  async getAvailableSlots(professionalId: number, date: string) {
    const localTargetDate = dayjs.tz(date, TIMEZONE);
    if (!localTargetDate.isValid()) throw new BadRequestException('Fecha inválida.');

    const dayMap = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
    const dayOfWeek = dayMap[localTargetDate.day()];
    const startOfDay = localTargetDate.startOf('day').toDate();
    const endOfDay = localTargetDate.endOf('day').toDate();

    const [professional, schedules, appointments] = await Promise.all([
      this.prisma.professional.findUnique({ where: { id: professionalId }, select: { id: true } }),
      this.prisma.schedule.findMany({
        where: { professionalId, dayOfWeek },
        select: { id: true, startTime: true, endTime: true, appointmentDuration: true },
      }),
      this.prisma.appointment.findMany({
        where: {
          professionalId,
          status: { not: AppointmentStatus.CANCELLED },
          dateTime: { gte: startOfDay, lte: endOfDay },
        },
        select: { dateTime: true },
      })
    ]);

    if (!professional) throw new NotFoundException('Profesional no encontrado.');
    if (!schedules.length) return [];

    const allSlots = schedules.flatMap((schedule) => this.generateAvailableSlots(schedule));
    const takenSlots = appointments.map((a) => dayjs(a.dateTime).tz(TIMEZONE).format('HH:mm'));
    const availableSlots = allSlots.filter((slot) => !takenSlots.includes(slot));
    
    const now = dayjs().tz(TIMEZONE);
    const isToday = localTargetDate.format('YYYY-MM-DD') === now.format('YYYY-MM-DD');

    return availableSlots.filter((slot) => {
      if (!isToday) return true;
      const [hour, minute] = slot.split(':').map(Number);
      return localTargetDate.hour(hour).minute(minute).isAfter(now);
    });
  }

  private generateAvailableSlots(schedule: { startTime: string; endTime: string; appointmentDuration: number }) {
    const slots: string[] = [];
    const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = schedule.endTime.split(':').map(Number);

    let currentMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    while (currentMinutes < endMinutes) {
      const hour = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
      const minute = (currentMinutes % 60).toString().padStart(2, '0');
      slots.push(`${hour}:${minute}`);
      currentMinutes += schedule.appointmentDuration;
    }
    return slots;
  }

  private validateAppointmentDateSync(appointmentDate: Date) {
    const now = dayjs().tz(TIMEZONE);
    const appointment = dayjs(appointmentDate).tz(TIMEZONE);

    if (isNaN(appointmentDate.getTime())) throw new BadRequestException('Fecha inválida.');
    if (appointment.isBefore(now)) throw new BadRequestException('No se pueden reservar turnos en fechas pasadas.');
    if (appointment.second() !== 0 || appointment.millisecond() !== 0) {
      throw new BadRequestException('Los turnos deben reservarse en horarios exactos.');
    }
  }

  // =====================================================================
  // LISTADOS Y GESTIÓN DE ESTADOS
  // =====================================================================
  async findAll(filters: FiltersAppointmentsDto & { clinicId?: number }) { // 👈 Tipado dinámico para filtrar opcionalmente por clínica
    const start = performance.now();
    const { page = 1, limit = 10, ...queryFilters } = filters;
    const skip = (page - 1) * limit;

    const dateFrom = queryFilters.dateFrom ? dayjs.tz(queryFilters.dateFrom, TIMEZONE).startOf('day') : null;
    const dateTo = queryFilters.dateTo ? dayjs.tz(queryFilters.dateTo, TIMEZONE).endOf('day') : null;

    if (dateFrom && dateTo && dateFrom.isAfter(dateTo)) {
      throw new BadRequestException('dateFrom no puede ser mayor que dateTo.');
    }

    const dateTimeFilter = dateFrom || dateTo
      ? {
          ...(dateFrom ? { gte: dateFrom.toDate() } : {}),
          ...(dateTo ? { lte: dateTo.toDate() } : {}),
        }
      : undefined;

    const whereCondition = {
      clinicId: queryFilters.clinicId, // 👈 Agregamos el filtro en el listado general
      patientId: queryFilters.patientId,
      professionalId: queryFilters.professionalId,
      coverageId: queryFilters.coverageId,
      ...(dateTimeFilter ? { dateTime: dateTimeFilter } : {}),
      notes: queryFilters.notes ? { contains: queryFilters.notes, mode: 'insensitive' as const } : undefined,
    };

    const [total, data] = await Promise.all([
      this.prisma.appointment.count({ where: whereCondition }),
      this.prisma.appointment.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { dateTime: 'asc' },
        select: {
          id: true, clinicId: true, patientId: true, professionalId: true, coverageId: true, dateTime: true, status: true, notes: true, createdAt: true,
          patient: { select: { id: true, firstName: true, lastName: true, dni: true, email: true } },
          professional: { select: { id: true, firstName: true, lastName: true, licenseNumber: true } },
          coverage: { select: { id: true, name: true } },
        },
      }),
    ]);

    console.log(`findAll appointments: ${(performance.now() - start).toFixed(2)} ms`);

    return { data, meta: { total, page, lastPage: Math.ceil(total / limit) || 1 } };
  }

  async findOne(id: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      select: {
        id: true,
        clinicId: true, // 👈 Agregado
        patientId: true,
        professionalId: true,
        coverageId: true,
        dateTime: true,
        status: true,
        notes: true,
        createdAt: true,
        patient: { select: { id: true, firstName: true, lastName: true, dni: true, email: true, clinicId: true } },
        professional: { select: { id: true, firstName: true, lastName: true, licenseNumber: true } },
        coverage: { select: { id: true, name: true } },
      },
    });
    if (!appointment) throw new NotFoundException(`Turno con ID ${id} no encontrado.`);
    return appointment;
  }

  async confirmAppointment(id: number) {
    const appointment = await this.findOne(id);
    if (appointment.status !== AppointmentStatus.PENDING) throw new BadRequestException('Solo se pueden confirmar turnos pendientes.');
    return this.prisma.appointment.update({ where: { id }, data: { status: AppointmentStatus.CONFIRMED } });
  }

  async cancelAppointment(id: number) {
    const appointment = await this.findOne(id);
    if (appointment.status === AppointmentStatus.CANCELLED) throw new BadRequestException('El turno ya está cancelado.');
    if (appointment.status === AppointmentStatus.COMPLETED) throw new BadRequestException('No se pueden cancelar turnos completados.');
    return this.prisma.appointment.update({ where: { id }, data: { status: AppointmentStatus.CANCELLED } });
  }

  async completeAppointment(id: number) {
    const appointment = await this.findOne(id);
    if (appointment.status !== AppointmentStatus.CONFIRMED) throw new BadRequestException('Solo se pueden completar turnos confirmados.');
    return this.prisma.appointment.update({ where: { id }, data: { status: AppointmentStatus.COMPLETED } });
  }
}