import { DayOfWeek } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FilterSchedulesDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  professionalId?: number;
    
  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;
}