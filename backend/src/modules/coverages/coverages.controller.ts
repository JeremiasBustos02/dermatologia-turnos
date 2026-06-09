import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards} from '@nestjs/common';
import { CoveragesService } from './coverages.service';
import { CreateCoverageDto } from './dto/create-coverage.dto';
import { UpdateCoverageDto } from './dto/update-coverage.dto';
import { FilterCoveragesDto } from './dto/FiltersCoveragesDto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PositiveIntPipe } from 'src/common/pipes/positive-int.pipe';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('Coverages')
@Controller('coverages')
export class CoveragesController {
  constructor(private readonly coveragesService: CoveragesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createCoverageDto: CreateCoverageDto) {
    return this.coveragesService.create(createCoverageDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query() filters: FilterCoveragesDto) {
    return this.coveragesService.findAll(filters);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id', PositiveIntPipe) id: number) {
    return this.coveragesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id', PositiveIntPipe) id: number, @Body() updateCoverageDto: UpdateCoverageDto) {
    return this.coveragesService.update(id, updateCoverageDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', PositiveIntPipe) id: number) {
    return this.coveragesService.remove(id);
  }
}
