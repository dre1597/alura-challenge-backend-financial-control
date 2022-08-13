import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PrismaPromise, Revenues } from '@prisma/client';

import { AddRevenueDto, FindRevenuesDto, UpdateRevenueDto } from './dto';
import { RevenuesService } from './revenues.service';

@Controller('revenues')
export class RevenuesController {
  constructor(private readonly revenuesService: RevenuesService) {}

  @Get()
  listRevenues(@Query() findRevenuesDto: FindRevenuesDto): PrismaPromise<Revenues[]> {
    return this.revenuesService.listRevenues(findRevenuesDto);
  }

  @Post()
  addRevenue(@Body() revenueData: AddRevenueDto): Promise<void> {
    return this.revenuesService.addRevenue(revenueData);
  }

  @Get(':id')
  listOneRevenue(@Param('id') id: string): Promise<Revenues> {
    return this.revenuesService.listOneRevenue(id);
  }

  @Patch(':id')
  updateRevenue(@Param('id') id: string, @Body() revenueData: UpdateRevenueDto): Promise<void> {
    return this.revenuesService.updateRevenue(id, revenueData);
  }

  @Delete(':id')
  deleteRevenue(@Param('id') id: string): Promise<void> {
    return this.revenuesService.deleteRevenue(id);
  }
}
