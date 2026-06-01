import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SpecialtiesModule } from './modules/specialties/specialties.module';
import { CoveragesModule } from './modules/coverages/coverages.module';
import { ProfessionalsModule } from './modules/professionals/professionals.module';

@Module({
  imports: [
    PrismaModule,
    SpecialtiesModule,
    CoveragesModule,
    ProfessionalsModule,
  ],
})
export class AppModule {}