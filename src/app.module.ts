import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SpecialtiesModule } from './modules/specialties/specialties.module';
import { CoveragesModule } from './modules/coverages/coverages.module';
import { ProfessionalsModule } from './modules/professionals/professionals.module';
import { SchedulesModule } from './modules/schedules/schedules.module';

@Module({
  imports: [
    PrismaModule,
    SpecialtiesModule,
    CoveragesModule,
    ProfessionalsModule,
    SchedulesModule,
  ],
})
export class AppModule {}