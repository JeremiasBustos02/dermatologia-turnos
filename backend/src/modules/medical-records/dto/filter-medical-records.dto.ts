import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FilterMedicalRecordsDto extends PaginationDto {
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
  appointmentId?: number;
}
