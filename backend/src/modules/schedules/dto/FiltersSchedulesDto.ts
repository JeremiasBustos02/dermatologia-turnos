import { DayOfWeek } from '@prisma/client';

export class FilterSchedulesDto {
    professionalId?: number;
    dayOfWeek?: DayOfWeek;
    startTime?: string;
    endTime?: string;
}