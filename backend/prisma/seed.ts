// prisma/seed.ts
import { PrismaClient, UserRole, DayOfWeek } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 1. Crear clínica de prueba
  const clinic = await prisma.clinic.create({
    data: {
      name: 'Clínica Dermatológica Alfa',
    },
  });
  console.log('Clínica creada:', clinic.name);

  // 2. Crear Super Admin vinculado a la clínica
  const admin = await prisma.user.upsert({
    where: { dni: '00000000' },
    update: {},
    create: {
      dni: '00000000',
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@consultorio.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      clinicId: clinic.id, // 👈 Asociado a la clínica
    },
  });
  console.log('Admin creado:', admin.email);

  // 3. Crear una Cobertura Médica (Obra Social) vinculada a la clínica
  const coverage = await prisma.coverage.upsert({
    where: { name: 'OSDE 310' },
    update: {},
    create: {
      name: 'OSDE 310',
      description: 'Plan clásico',
      clinics: { connect: { id: clinic.id } }
    }
  });

  // 4. Crear un Profesional (Médico) vinculado a la clínica
  const userProfessional = await prisma.user.create({
    data: {
      dni: '11111111',
      firstName: 'Carlos',
      lastName: 'Pérez',
      email: 'drperez@consultorio.com',
      password: hashedPassword,
      role: UserRole.PROFESSIONAL,
      clinicId: clinic.id,
      professionalProfile: {
        create: {
          firstName: 'Carlos',
          lastName: 'Pérez',
          licenseNumber: 'MN-99543',
          coverages: { connect: { id: coverage.id } }, // Acepta OSDE
          schedules: {
            create: {
              startTime: '09:00',
              endTime: '13:00',
              appointmentDuration: 30, // 30 minutos por turno
              dayOfWeek: DayOfWeek.MONDAY, // Atiende los Lunes
            }
          }
        }
      }
    }
  });
  console.log('Médico Profesional creado:', userProfessional.email);

  // 5. Crear un Paciente de prueba vinculado a la clínica
  const patient = await prisma.user.create({
    data: {
      dni: '22222222',
      firstName: 'Juan',
      lastName: 'Gómez',
      email: 'juan@gmail.com',
      password: hashedPassword,
      role: UserRole.PATIENT,
      clinicId: clinic.id,
      coverageId: coverage.id
    }
  });
  console.log('Paciente creado:', patient.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });