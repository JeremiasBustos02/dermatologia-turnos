import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  patientId!: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  professionalId!: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  coverageId!: number;

  @ApiProperty()
  @IsDateString()
  dateTime!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  notes?: string;
}