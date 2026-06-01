import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  @IsPositive()
  patientId!: number;

  @IsInt()
  @IsPositive()
  professionalId!: number;

  @IsInt()
  @IsPositive()
  coverageId!: number;

  @IsDateString()
  dateTime!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}