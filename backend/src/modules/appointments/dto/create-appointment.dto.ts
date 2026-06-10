import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  patientId!: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  professionalId!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  coverageId?: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dateTime!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  notes?: string;
}