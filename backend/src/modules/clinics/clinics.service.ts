import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClinicsService {
  constructor(private prisma: PrismaService) {}

  async createClinicWithAdmin(dto: CreateClinicDto) {
    const existingDni = await this.prisma.user.findUnique({
      where: { dni: dto.adminDni },
      select: { id: true },
    });

    if (existingDni) {
      throw new ConflictException(`El DNI ${dto.adminDni} ya está registrado`);
    }

    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.adminEmail },
      select: { id: true },
    });

    if (existingEmail) {
      throw new ConflictException(`El email ${dto.adminEmail} ya está registrado`);
    }

    const hashedPassword = await bcrypt.hash(dto.adminPassword, 10);

    const [clinic, admin] = await this.prisma.$transaction(async (tx) => {
      const clinic = await tx.clinic.create({
        data: { name: dto.clinicName },
      });

      const admin = await tx.user.create({
        data: {
          dni: dto.adminDni,
          firstName: dto.adminFirstName,
          lastName: dto.adminLastName,
          email: dto.adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          clinicId: clinic.id,
        },
        select: {
          id: true,
          dni: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      });

      return [clinic, admin];
    });

    return { clinic, admin };
  }
}
