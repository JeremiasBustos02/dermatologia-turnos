import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) { }

  async create(createAppointmentDto: CreateAppointmentDto) {
    const {
      patientId,
      professionalId,
      coverageId,
      dateTime,
      notes,
    } = createAppointmentDto;

    const appointmentDate = new Date(dateTime);

    const [patient, professional, coverage, existingAppointment] =
      await Promise.all([
        this.prisma.user.findUnique({
          where: { id: patientId },
        }),
        this.prisma.professional.findUnique({
          where: { id: professionalId },
        }),
        this.prisma.coverage.findUnique({
          where: { id: coverageId },
        }),
        this.prisma.appointment.findFirst({
          where: {
            professionalId,
            dateTime: appointmentDate,
          },
        }),
      ]);

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

    if (!patient) {
      throw new NotFoundException(
        `Paciente con ID ${createAppointmentDto.patientId} no encontrado.`,
      );
    }
    if (patient.role !== 'PATIENT') {
      throw new BadRequestException(
        'El usuario seleccionado no es un paciente.',
      );
    }
    if (!professional) {
      throw new NotFoundException(
        `Profesional con ID ${createAppointmentDto.professionalId} no encontrado.`,
      );
    }
    if (!coverage) {
      throw new NotFoundException(
        `Cobertura con ID ${createAppointmentDto.coverageId} no encontrada.`,
      );
    }

    if (!professionalWithCoverage) {
      throw new BadRequestException(
        'El profesional no acepta esa cobertura.',
      );
    }

    if (existingAppointment) {
      throw new BadRequestException(
        `El profesional con ID ${createAppointmentDto.professionalId} ya tiene una cita programada para la fecha y hora ${createAppointmentDto.dateTime}.`,
      );
    }

    return this.prisma.appointment.create({
      data: {
        patientId,
        professionalId,
        coverageId,
        dateTime: appointmentDate,
        notes,
      },
    });
  }

  findAll() {
    return this.prisma.appointment.findMany({
      include: {
        patient: true,
        professional: true,
        coverage: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        professional: true,
        coverage: true,
      },
    });
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return this.prisma.appointment.update({
      where: { id },
      data: updateAppointmentDto,
    });
  }

  remove(id: number) {
    return this.prisma.appointment.delete({
      where: { id },
    });
  }
}