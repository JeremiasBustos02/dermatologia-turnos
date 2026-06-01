import {
    IsEnum,
    IsInt,
    IsPositive,
    IsString,
    Matches,
} from 'class-validator';

import { DayOfWeek } from '@prisma/client';

export class CreateScheduleDto {
    @IsInt()
    @IsPositive()
    professionalId!: number;

    @IsEnum(DayOfWeek)
    dayOfWeek!: DayOfWeek;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    startTime!: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    endTime!: string;

    @IsInt()
    @IsPositive()
    appointmentDuration!: number;
}