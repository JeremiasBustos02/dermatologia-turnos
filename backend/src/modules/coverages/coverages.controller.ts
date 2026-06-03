import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards} from '@nestjs/common';
import { CoveragesService } from './coverages.service';
import { CreateCoverageDto } from './dto/create-coverage.dto';
import { UpdateCoverageDto } from './dto/update-coverage.dto';
import { FilterCoveragesDto } from './dto/FiltersCoveragesDto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';

@UseGuards(JwtAuthGuard)
@Controller('coverages')
export class CoveragesController {
  constructor(private readonly coveragesService: CoveragesService) {}

  @Post()
  create(@Body() createCoverageDto: CreateCoverageDto) {
    return this.coveragesService.create(createCoverageDto);
  }

  @Get()
  findAll(@Query() filters: FilterCoveragesDto) {
    return this.coveragesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coveragesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoverageDto: UpdateCoverageDto) {
    return this.coveragesService.update(+id, updateCoverageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coveragesService.remove(+id);
  }
}
