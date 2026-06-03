import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCoverageDto {
  @ApiProperty()
  @IsString()
  name!: string;
}