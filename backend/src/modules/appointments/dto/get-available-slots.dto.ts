import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsPositive } from 'class-validator';

export class GetAvailableSlotsDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  professionalId!: number;

  @ApiProperty({ example: '2026-06-07' })
  @IsDateString()
  date!: string;
}
