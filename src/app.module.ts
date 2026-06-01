import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SpecialtiesModule } from './modules/specialties/specialties.module';
import { CoveragesModule } from './modules/coverages/coverages.module';
import { ProfessionalsModule } from './modules/professionals/professionals.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { UsersModule } from './modules/users/users.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';

@Module({
  imports: [
    PrismaModule,
    SpecialtiesModule,
    CoveragesModule,
    ProfessionalsModule,
    SchedulesModule,
    UsersModule,
    AppointmentsModule,
  ],
})
export class AppModule {}