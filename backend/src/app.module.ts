import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { SpecialtiesModule } from './modules/specialties/specialties.module';
import { CoveragesModule } from './modules/coverages/coverages.module';
import { ProfessionalsModule } from './modules/professionals/professionals.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { UsersModule } from './modules/users/users.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    SpecialtiesModule,
    CoveragesModule,
    ProfessionalsModule,
    SchedulesModule,
    UsersModule,
    AppointmentsModule,
    AuthModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 20,
    }]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}