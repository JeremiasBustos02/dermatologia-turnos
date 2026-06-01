import {
    IsEnum,
    IsInt,
    IsPositive,
    IsString,
    Matches,
} from 'class-validator';

export enum DayOfWeek {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY',
}

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