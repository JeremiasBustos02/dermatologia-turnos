import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { FilterMedicalRecordsDto } from './dto/filter-medical-records.dto';

@Injectable()
export class MedicalRecordsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMedicalRecordDto) {
    return this.prisma.$transaction(async (tx) => {
      const appointment = dto.appointmentId
        ? await tx.appointment.findUnique({
            where: { id: dto.appointmentId },
            select: { id: true, patientId: true, professionalId: true, medicalRecord: { select: { id: true } } },
          })
        : null;

      if (dto.appointmentId && !appointment) {
        throw new NotFoundException(`No existe un turno con ID ${dto.appointmentId}`);
      }

      if (appointment?.medicalRecord) {
        throw new NotFoundException('Ese turno ya tiene una evolución asociada');
      }

      if (appointment && (appointment.patientId !== dto.patientId || appointment.professionalId !== dto.professionalId)) {
        throw new NotFoundException('La evolución no coincide con el paciente o profesional del turno');
      }

      return tx.medicalRecord.create({
        data: dto,
        select: {
          id: true,
          patientId: true,
          professionalId: true,
          appointmentId: true,
          reason: true,
          evolution: true,
          prescription: true,
          createdAt: true,
          updatedAt: true,
          patient: { select: { firstName: true, lastName: true, dni: true } },
          professional: { select: { firstName: true, lastName: true } },
        },
      });
    });
  }

  async findAll(filters: FilterMedicalRecordsDto) {
    const { page = 1, limit = 10, ...queryFilters } = filters;
    const skip = (page - 1) * limit;

    const whereCondition = {
      patientId: queryFilters.patientId,
      professionalId: queryFilters.professionalId,
      appointmentId: queryFilters.appointmentId,
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.medicalRecord.count({ where: whereCondition }),
      this.prisma.medicalRecord.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // Traemos los más recientes primero
        select: {
          id: true,
          patientId: true,
          professionalId: true,
          appointmentId: true,
          reason: true,
          evolution: true,
          prescription: true,
          createdAt: true,
          professional: { select: { id: true, firstName: true, lastName: true } },
          patient: { select: { id: true, firstName: true, lastName: true, dni: true } },
          appointment: { select: { dateTime: true, status: true } }
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
    const record = await this.prisma.medicalRecord.findUnique({
      where: { id },
      select: {
        id: true,
        patientId: true,
        professionalId: true,
        appointmentId: true,
        reason: true,
        evolution: true,
        prescription: true,
        createdAt: true,
        updatedAt: true,
        professional: { select: { id: true, firstName: true, lastName: true } },
        patient: { select: { id: true, firstName: true, lastName: true, dni: true } },
      },
    });

    if (!record) {
      throw new NotFoundException(`No existe una evolución con ID ${id}`);
    }

    return record;
  }
}
