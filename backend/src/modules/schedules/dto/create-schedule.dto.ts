import {
  IsEnum,
  IsInt,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { DayOfWeek } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  professionalId!: number;

  @ApiProperty({ enum: DayOfWeek })
  @IsEnum(DayOfWeek)
  dayOfWeek!: DayOfWeek;

  @ApiProperty({ example: '08:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'El formato de startTime debe ser HH:MM (24hs)',
  })
  startTime!: string;

  @ApiProperty({ example: '12:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'El formato de endTime debe ser HH:MM (24hs)',
  })
  endTime!: string;

  @ApiProperty({ example: 30 })
  @IsInt()
  @IsPositive()
  appointmentDuration!: number;
}