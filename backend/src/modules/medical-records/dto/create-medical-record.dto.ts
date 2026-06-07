import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMedicalRecordDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  patientId!: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  professionalId!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  appointmentId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  evolution!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prescription?: string;
}
