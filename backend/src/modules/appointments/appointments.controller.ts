import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { FiltersAppointmentsDto } from './dto/FiltersAppointmentsDto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  findAll(@Query() filters: FiltersAppointmentsDto) {
    return this.appointmentsService.findAll(filters);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Patch(':id/confirm')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  confirmAppointment(@Param('id') id: string) {
    return this.appointmentsService.confirmAppointment(+id);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  cancelAppointment(@Param('id') id: string) {
    return this.appointmentsService.cancelAppointment(+id);
  }

  @Patch(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  completeAppointment(@Param('id') id: string) {
    return this.appointmentsService.completeAppointment(+id);
  }

  @Get('available-slots')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  getAvailableSlots(
    @Query('professionalId') professionalId: string,
    @Query('date') date: string,
  ) {
    return this.appointmentsService.getAvailableSlots(
      Number(professionalId),
      date,
    );
  }
}
