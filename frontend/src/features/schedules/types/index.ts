export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface Schedule {
  id: number;
  professionalId: number;
  dayOfWeek: DayOfWeek;
  startTime: string; 
  endTime: string;
  appointmentDuration: number;
}

export interface CreateScheduleDTO {
  professionalId: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  appointmentDuration: number;
  clinicId: number;
}