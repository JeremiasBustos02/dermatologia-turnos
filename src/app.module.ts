import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SpecialtiesModule } from './modules/specialties/specialties.module';
import { CoveragesModule } from './modules/coverages/coverages.module';

@Module({
  imports: [
    PrismaModule,
    SpecialtiesModule,
    CoveragesModule,
  ],
})
export class AppModule {}