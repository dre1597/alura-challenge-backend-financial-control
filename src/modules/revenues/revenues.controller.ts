import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PrismaPromise, Revenues } from '@prisma/client';

import { Month } from '../../utils/enum';
import { AddRevenueDto, FilterRevenuesDto, UpdateRevenueDto } from './dto';
import { RevenuesService } from './revenues.service';

@Controller('revenues')
export class RevenuesController {
  constructor(private readonly revenuesService: RevenuesService) {}

  @Get()
  listRevenues(@Query() filterRevenuesDto: FilterRevenuesDto): PrismaPromise<Revenues[]> {
    return this.revenuesService.listRevenues(filterRevenuesDto);
  }

  @Post()
  addRevenue(@Body() addRevenueDto: AddRevenueDto): Promise<void> {
    return this.revenuesService.addRevenue(addRevenueDto);
  }

  @Get(':id')
  getRevenue(@Param('id') id: string): Promise<Revenues> {
    return this.revenuesService.getRevenue(id);
  }

  @Patch(':id')
  updateRevenue(
    @Param('id') id: string,
    @Body() updateRevenueDto: UpdateRevenueDto,
  ): Promise<void> {
    return this.revenuesService.updateRevenue(id, updateRevenueDto);
  }

  @Delete(':id')
  deleteRevenue(@Param('id') id: string): Promise<void> {
    return this.revenuesService.deleteRevenue(id);
  }

  @Get(':year/:month')
  listRevenuesByYearMonth(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', new ParseEnumPipe(Month)) month: Month,
  ): PrismaPromise<Revenues[]> {
    return this.revenuesService.listRevenuesByYearMonth(year, month);
  }
}
