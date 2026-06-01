import { Module } from '@nestjs/common';
import { CoveragesService } from './coverages.service';
import { CoveragesController } from './coverages.controller';

@Module({
  controllers: [CoveragesController],
  providers: [CoveragesService],
})
export class CoveragesModule {}
