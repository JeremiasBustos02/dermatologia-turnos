import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { FiltersAppointmentsDto } from './dto/FiltersAppointmentsDto';
import { GetAvailableSlotsDto } from './dto/get-available-slots.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { RolesGuard } from '../auth/guards/roles-guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PositiveIntPipe } from 'src/common/pipes/positive-int.pipe';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Appointments')
@ApiBearerAuth('access-token')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Get('available-slots')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  getAvailableSlots(
    @Query() query: GetAvailableSlotsDto,
  ) {
    return this.appointmentsService.getAvailableSlots(query.professionalId, query.date);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  create(@Body() createAppointmentDto: CreateAppointmentDto, @Req() req: any) {
    const clinicId = req.user.clinicId;
    return this.appointmentsService.create({ ...createAppointmentDto, clinicId });
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  findAll(@Query() filters: FiltersAppointmentsDto, @Req() req: any) {
    const clinicId = req.user.clinicId;
    return this.appointmentsService.findAll({ ...filters, clinicId });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  findOne(@Param('id', PositiveIntPipe) id: number) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  update(
    @Param('id', PositiveIntPipe) id: number, 
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Req() req: any
  ) {
    const clinicId = req.user.clinicId;
    return this.appointmentsService.update(id, { ...updateAppointmentDto, clinicId }, req.user.userId, req.user.role);
  }

  @Patch(':id/confirm')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  confirmAppointment(@Param('id', PositiveIntPipe) id: number, @Req() req: any) {
    return this.appointmentsService.confirmAppointment(id, req.user.userId, req.user.role);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.PATIENT)
  cancelAppointment(@Param('id', PositiveIntPipe) id: number, @Req() req: any) {
    return this.appointmentsService.cancelAppointment(id, req.user.userId, req.user.role);
  }

  @Patch(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  completeAppointment(@Param('id', PositiveIntPipe) id: number) {
    return this.appointmentsService.completeAppointment(id);
  }
}