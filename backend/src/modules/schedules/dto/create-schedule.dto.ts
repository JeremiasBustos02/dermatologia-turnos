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

    @ApiProperty()
    @IsEnum(DayOfWeek)
    dayOfWeek!: DayOfWeek;

    @ApiProperty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    startTime!: string;

    @ApiProperty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    endTime!: string;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    appointmentDuration!: number;
}