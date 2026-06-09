import { PrismaClient, UserRole, DayOfWeek } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 1. Crear clínica de prueba
  const clinic = await prisma.clinic.create({
    data: { name: 'Clínica Dermatológica Alfa' },
  });
  console.log('Clínica creada:', clinic.name);

  // 2. Crear Super Admin (Dueño del Software)
  const superAdmin = await prisma.user.upsert({
    where: { dni: '00000000' },
    update: {},
    create: {
      dni: '00000000',
      firstName: 'Super',
      lastName: 'Admin',
      email: 'owner@saas.com',
      password: hashedPassword,
      role: UserRole.SUPERADMIN, 
      clinicId: clinic.id, 
    },
  });
  console.log('Super Admin creado:', superAdmin.email);

  // 3. Crear Admin de la Clínica (El cliente que te contrata)
  const clinicAdmin = await prisma.user.upsert({
    where: { dni: '99999999' },
    update: {},
    create: {
      dni: '99999999',
      firstName: 'Director',
      lastName: 'Médico',
      email: 'admin@clinicaalfa.com',
      password: hashedPassword,
      role: UserRole.ADMIN, // 👈 El rol operativo normal
      clinicId: clinic.id, 
    },
  });
  console.log('Admin de Clínica creado:', clinicAdmin.email);

  // 4. Crear Cobertura
  const coverage = await prisma.coverage.upsert({
    where: { name: 'OSDE 310' },
    update: {},
    create: {
      name: 'OSDE 310',
      description: 'Plan clásico',
      clinics: { connect: { id: clinic.id } }
    }
  });

  // 5. Crear Profesional
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
          coverages: { connect: { id: coverage.id } },
          schedules: {
            create: {
              startTime: '09:00',
              endTime: '13:00',
              appointmentDuration: 30,
              dayOfWeek: DayOfWeek.MONDAY,
            }
          }
        }
      }
    }
  });
  console.log('Médico Profesional creado:', userProfessional.email);

  // 6. Crear Paciente
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