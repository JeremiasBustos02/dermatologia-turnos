import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FiltersAppointmentsDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  patientId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  professionalId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  coverageId?: number;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}