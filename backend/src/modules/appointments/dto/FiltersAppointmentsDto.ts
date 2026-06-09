import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, IsPositive, IsDateString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FiltersAppointmentsDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  patientId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  professionalId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
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
